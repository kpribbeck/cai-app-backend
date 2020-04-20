const KoaRouter = require('koa-router');

const router = new KoaRouter();

const User = require('../models/user');

async function loadUser(ctx, next) {
    ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
    return next();
}

// @route    GET api/users
// @desc     Get all users
// @access   Public
router.get('users.list', '/', async (ctx) =>
{
  try
  {
    console.log("CTX: " + JSON.stringify(ctx));
    const usersList = await ctx.orm.user.findAll();
    
    // handle not found
    if (!usersList)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    ctx.body = usersList;
  }
  catch(err)
  {
    console.log(err);
  }
});

// @route    GET api/users/:id
// @desc     Get user by id
// @access   Public
router.get('users.view', '/:id', async (ctx) => 
{
  try
  {
    console.log("CTX: " + JSON.stringify(ctx));
    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let userId = parseInt(url.substring(index + 1));

    const user = await ctx.orm.user.findByPk(userId);
    
    // handle not found
    if (!user)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    // send user content
    ctx.body = user;

  }
  catch(err)
  {
    console.log(err);
  }
})


// @route    POST api/users 
// @desc     Create a new user
// @access   Private
router.post('users.create', '/', async (ctx) => {

  // we need to parse the body received (json) to a javascript object
  const user = ctx.orm.user.build(JSON.parse(ctx.request.body));

  try
  {
    // No need to handle duplicates of any kind here
    await user.save({ fields: ['user_name', 'password', 'name', 'last_name', 'mail', 'student_id'] });
    ctx.response.status = 201;
    ctx.response.message = "Created";
    ctx.body = user;
  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    PUT api/users/:id
// @desc     Replace an existing user
// @access   Private
router.put('users.update', '/:id', async (ctx) => {
  const newUser = ctx.orm.user.build(JSON.parse(ctx.request.body));

  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let userId = parseInt(url.substring(index + 1));

    const user = await ctx.orm.user.findByPk(userId);

    user.title = newUser.title;
    user.body = newUser.body;    

    // handle not found
    if (!user)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found.";
      throw new Error("404 Not found.");
    }

    await user.save();

    // send user content
    ctx.response.status = 200;
    ctx.response.message = "OK";
    ctx.body = user;

  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    DEL api/users/:id 
// @desc     Delete an existing user
// @access   Private
router.del('users.delete', '/:id', async (ctx) => {
  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let userId = parseInt(url.substring(index + 1));

    const user = await ctx.orm.user.findByPk(userId);
    
    // handle not found
    if (!user)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    user.destroy();
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