const KoaRouter = require('koa-router');
const authMiddle = require('../middlewares/auth');

const router = new KoaRouter();


// @route    GET api/proyects
// @desc     Get all proyects
// @access   Public
router.get('proyects.list', '/', async (ctx) =>
{
  try
  {
    // console.log("CTX: " + JSON.stringify(ctx));
    const proyectsList = await ctx.orm.proyect.findAll();
    
    // handle not found
    if (!proyectsList)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    ctx.body = proyectsList;
  }
  catch(err)
  {
    console.log(err);
  }
});

// @route    GET api/proyects/:id
// @desc     Get proyect by id
// @access   Public
router.get('proyects.view', '/:id', async (ctx) => 
{
  try
  {
    // console.log("CTX: " + JSON.stringify(ctx));
    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let proyectId = parseInt(url.substring(index + 1));

    const proyect = await ctx.orm.proyect.findByPk(proyectId);
    
    // handle not found
    if (!proyect)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    // send proyect content
    ctx.body = proyect;

  }
  catch(err)
  {
    console.log(err);
  }
})


// @route    POST api/proyects 
// @desc     Create a new proyect
// @access   Private
router.post('proyects.create', '/', authMiddle, async (ctx) => {

  const proyect = ctx.orm.proyect.build(ctx.request.body);
  proyect.userId = ctx.request.user.id;

  try
  {
    // No need to handle duplicates of any kind here
    await proyect.save({ fields: ['name', 'description', 'contact', 'picture', 'userId'] });
    ctx.response.status = 201;
    ctx.response.message = "Created";
    ctx.body = proyect;
  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    PUT api/proyects/:id
// @desc     Replace an existing proyect
// @access   Private
router.put('proyects.update', '/:id', authMiddle, async (ctx) => {
  const newProyect = ctx.orm.proyect.build(ctx.request.body);

  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let proyectId = parseInt(url.substring(index + 1));

    // Get current proyect
    const proyect = await ctx.orm.proyect.findByPk(proyectId);

    // handle not found
    if (!proyect)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found.";
      throw new Error("404 Not found.");
    }

    // Check if user is author
    if (proyect.userId !== ctx.request.user.id)
    {
      // Permission denied
      ctx.response.status = 401;
      ctx.response.message = "Unauthorized.";
      throw new Error("401 Unauthorized.");
    }

    proyect.name = newProyect.name;
    proyect.description = newProyect.description;
    proyect.contact = newProyect.contact;
    proyect.picture = newProyect.picture;

    await proyect.save();

    // send proyect content
    ctx.response.status = 200;
    ctx.response.message = "OK";
    ctx.body = proyect;

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

// @route    DEL api/proyects/:id 
// @desc     Delete an existing proyect
// @access   Private
router.del('proyects.delete', '/:id', authMiddle, async (ctx) => {
  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let proyectId = parseInt(url.substring(index + 1));

    const proyect = await ctx.orm.proyect.findByPk(proyectId);
    
    // handle not found
    if (!proyect)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    // Check if user owns this story || admin
    if (proyect.userId !== ctx.request.user.id && ctx.request.user.is_admin != 1)
    {
      // Permission denied
      ctx.response.status = 401;
      ctx.response.message = "Unauthorized";
      throw new Error("401 Unauthorized.");
    }

    proyect.destroy();
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