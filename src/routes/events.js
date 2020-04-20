const KoaRouter = require('koa-router');

const router = new KoaRouter();

const Event = require('../models/event');

async function loadEvent(ctx, next) {
    ctx.state.event = await ctx.orm.event.findByPk(ctx.params.id);
    return next();
}

// @route    GET api/events
// @desc     Get all events
// @access   Public
router.get('events.list', '/', async (ctx) =>
{
  try
  {
    console.log("CTX: " + JSON.stringify(ctx));
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
    console.log("CTX: " + JSON.stringify(ctx));
    
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
router.post('events.create', '/', async (ctx) => {

  // we need to parse the body received (json) to a javascript object
  const event = ctx.orm.event.build(JSON.parse(ctx.request.body));

  try
  {
    // No need to handle duplicates of any kind here
    await event.save({ fields: ['title', 'description', 'organizer', 'place', 'category'] });
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
router.put('events.update', '/:id', async (ctx) => {
  const newEvent = ctx.orm.event.build(JSON.parse(ctx.request.body));

  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let eventId = parseInt(url.substring(index + 1));

    const event = await ctx.orm.event.findByPk(eventId);

    event.title = newEvent.title;
    event.description = newEvent.description;
    event.organizer = newEvent.organizer;
    event.place = newEvent.place;
    event.category = newEvent.category;    

    // handle not found
    if (!event)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found.";
      throw new Error("404 Not found.");
    }

    await event.save();

    // send event content
    ctx.response.status = 200;
    ctx.response.message = "OK";
    ctx.body = event;

  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    DEL api/events/:id 
// @desc     Delete an existing event
// @access   Private
router.del('events.delete', '/:id', async (ctx) => {
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

    event.destroy();
    ctx.response.status = 200;
    ctx.response.message = "OK";

  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

module.exports = router;