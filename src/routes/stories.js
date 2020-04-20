const KoaRouter = require('koa-router');

const router = new KoaRouter();


// @route    GET api/stories
// @desc     Get all stories
// @access   Public
router.get('stories.list', '/', async (ctx) =>
{
  try
  {
    console.log("CTX: " + JSON.stringify(ctx));
    const storiesList = await ctx.orm.story.findAll();
    
    // handle not found
    if (!storiesList)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    ctx.body = storiesList;
  }
  catch(err)
  {
    console.log(err);
  }
});

// @route    GET api/stories/:id
// @desc     Get story by id
// @access   Public
router.get('stories.view', '/:id', async (ctx) => 
{
  try
  {
    console.log("CTX: " + JSON.stringify(ctx));
    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let storyId = parseInt(url.substring(index + 1));

    const story = await ctx.orm.story.findByPk(storyId);
    
    // handle not found
    if (!story)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    // send story content
    ctx.body = story;

  }
  catch(err)
  {
    console.log(err);
  }
})


// @route    POST api/stories 
// @desc     Create a new story
// @access   Private
router.post('stories.create', '/', async (ctx) => {

  const story = ctx.orm.story.build(ctx.request.body);

  try
  {
    // No need to handle duplicates of any kind here
    await story.save({ fields: ['title', 'body'] });
    ctx.response.status = 201;
    ctx.response.message = "Created";
    ctx.body = story;
  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    PUT api/stories/:id
// @desc     Replace an existing story
// @access   Private
router.put('stories.update', '/:id', async (ctx) => {
  const newStory = ctx.orm.story.build(ctx.request.body);

  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let storyId = parseInt(url.substring(index + 1));

    const story = await ctx.orm.story.findByPk(storyId);

    console.log("Prev title: " + story.title);

    story.title = newStory.title;
    story.body = newStory.body;

    console.log("Ne title: " + story.title);

    // handle not found
    if (!story)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found.";
      throw new Error("404 Not found.");
    }

    await story.save();

    // send story content
    ctx.response.status = 200;
    ctx.response.message = "OK";
    ctx.body = story;

  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    DEL api/stories/:id 
// @desc     Delete an existing story
// @access   Private
router.del('stories.delete', '/:id', async (ctx) => {
  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let storyId = parseInt(url.substring(index + 1));

    const story = await ctx.orm.story.findByPk(storyId);
    
    // handle not found
    if (!story)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    story.destroy();
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