const KoaRouter = require('koa-router');

const router = new KoaRouter();

const Object = require('../models/object');

async function loadObject(ctx, next) {
    ctx.state.object = await ctx.orm.object.findByPk(ctx.params.id);
    return next();
}

// @route    GET api/objects
// @desc     Get all objects
// @access   Public
router.get('objects.list', '/', async (ctx) =>
{
  try
  {
    console.log("CTX: " + JSON.stringify(ctx));
    const objectsList = await ctx.orm.object.findAll();
    
    // handle not found
    if (!objectsList)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    ctx.body = objectsList;
  }
  catch(err)
  {
    console.log(err);
  }
});

// @route    GET api/objects/:id
// @desc     Get object by id
// @access   Public
router.get('objects.view', '/:id', async (ctx) => 
{
  try
  {
    console.log("CTX: " + JSON.stringify(ctx));
    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let objectId = parseInt(url.substring(index + 1));

    const object = await ctx.orm.object.findByPk(objectId);
    
    // handle not found
    if (!object)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    // send object content
    ctx.body = object;

  }
  catch(err)
  {
    console.log(err);
  }
})


// @route    POST api/objects 
// @desc     Create a new object
// @access   Private
router.post('objects.create', '/', async (ctx) => {

  // we need to parse the body received (json) to a javascript object
  const object = ctx.orm.object.build(JSON.parse(ctx.request.body));

  try
  {
    // No need to handle duplicates of any kind here
    await object.save({ fields: ['name', 'description', 'stock', 'picture'] });
    ctx.response.status = 201;
    ctx.response.message = "Created";
    ctx.body = object;
  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    PUT api/objects/:id
// @desc     Replace an existing object
// @access   Private
router.put('objects.update', '/:id', async (ctx) => {
  const newObject = ctx.orm.object.build(JSON.parse(ctx.request.body));

  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let objectId = parseInt(url.substring(index + 1));

    const object = await ctx.orm.object.findByPk(objectId);

    object.title = newObject.title;
    object.body = newObject.body;    

    // handle not found
    if (!object)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found.";
      throw new Error("404 Not found.");
    }

    await object.save();

    // send object content
    ctx.response.status = 200;
    ctx.response.message = "OK";
    ctx.body = object;

  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    DEL api/objects/:id 
// @desc     Delete an existing object
// @access   Private
router.del('objects.delete', '/:id', async (ctx) => {
  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let objectId = parseInt(url.substring(index + 1));

    const object = await ctx.orm.object.findByPk(objectId);
    
    // handle not found
    if (!object)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    object.destroy();
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