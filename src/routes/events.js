const KoaRouter = require('koa-router');
const authMiddle = require('../middlewares/auth');

const router = new KoaRouter();


// @route    GET api/events
// @desc     Get all events
// @access   Public
router.get('events.list', '/', async (ctx) =>
{
  try
  {
    // console.log("CTX: " + JSON.stringify(ctx));
    const eventsList = await ctx.orm.event.findAll();
    
    // handle not found
    if (!eventsList)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    ctx.body = eventsList;
  }
  catch(err)
  {
    console.log(err);
  }
});

// @route    GET api/events/:id
// @desc     Get event by id
// @access   Public
router.get('events.view', '/:id', async (ctx) => 
{
  try
  {
    // console.log("CTX: " + JSON.stringify(ctx));
    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let eventId = parseInt(url.substring(index + 1));

    const event = await ctx.orm.event.findByPk(eventId);
    
    // handle not found
    if (!event)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    // send event content
    ctx.body = event;

  }
  catch(err)
  {
    console.log(err);
  }
})


// @route    POST api/events 
// @desc     Create a new event
// @access   Private
router.post('events.create', '/', authMiddle, async (ctx) => {

  const event = ctx.orm.event.build(ctx.request.body);
  event.userId = ctx.request.user.id;

  try
  {
    // No need to handle duplicates of any kind here
    await event.save({ fields: ['title', 'description', 'organizer', 'place', 'category', 'userId'] });
    ctx.response.status = 201;
    ctx.response.message = "Created";
    ctx.body = event;
  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    PUT api/events/:id
// @desc     Replace an existing event
// @access   Private
router.put('events.update', '/:id', authMiddle, async (ctx) => {
  const newEvent = ctx.orm.event.build(ctx.request.body);

  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let eventId = parseInt(url.substring(index + 1));

    // Get current event
    const event = await ctx.orm.event.findByPk(eventId);

    // handle not found
    if (!event)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found.";
      throw new Error("404 Not found.");
    }

    // Check if usre is author
    if (event.userId !== ctx.request.user.id)
    {
      // Permission denied
      ctx.response.status = 401;
      ctx.response.message = "Unauthorized.";
      throw new Error("401 Unauthorized.");
    }

    event.title = newEvent.title;
    event.description = newEvent.description;
    event.organizer = newEvent.organizer;
    event.place = newEvent.place;
    event.category = newEvent.category;

    await event.save();

    // send event content
    ctx.response.status = 200;
    ctx.response.message = "OK";
    ctx.body = event;

  }
  catch(err)
  {
    console.log(err);
    if (ctx.response.status === 404)
    {
      ctx.response.status = 500;
      ctx.response.message = "Internal server error.";
    }
  }
});

// @route    DEL api/events/:id 
// @desc     Delete an existing event
// @access   Private
router.del('events.delete', '/:id', authMiddle, async (ctx) => {
  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let eventId = parseInt(url.substring(index + 1));

    const event = await ctx.orm.event.findByPk(eventId);
    
    // handle not found
    if (!event)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    // Check if user owns this event || admin
    if (event.userId !== ctx.request.user.id && ctx.request.user.is_admin != 1)
    {
      // Permission denied
      ctx.response.status = 401;
      ctx.response.message = "Unauthorized";
      throw new Error("401 Unauthorized");
    }

    event.destroy();
    ctx.response.status = 200;
    ctx.response.message = "OK";

  }
  catch(err)
  {
    console.log(err);
    if (ctx.response.status === 404)
    {
      ctx.response.status = 500;
      ctx.response.message = "Internal server error.";
    }
  }
});

module.exports = router;