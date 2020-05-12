const KoaRouter = require('koa-router');
const authMiddle = require('../middlewares/auth');

const router = new KoaRouter();

const User = require('../models/user');


// @route    GET api/users
// @desc     Get all users
// @access   Private
router.get('users.list', '/', authMiddle, async (ctx) =>
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
    if (ctx.response.status !== 404)
    {
      ctx.response.status = 500;
      ctx.response.message = "Internal server error.";
    }
  }
});

// @route    GET api/users/:id
// @desc     Get user by id
// @access   Private
router.get('users.view', '/:id', authMiddle, async (ctx) => 
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
    if (ctx.response.status !== 404)
    {
      ctx.response.status = 500;
      ctx.response.message = "Internal server error.";
    }
  }
})

// @route    PUT api/users/:id
// @desc     Replace an existing user
// @access   Private
router.put('users.update', '/:id', authMiddle, async (ctx) => {

  const newUser = ctx.orm.user.build(ctx.request.body);

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
router.del('users.delete', '/:id', authMiddle, async (ctx) => {
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

    // Only self or admin can delete a user
    if (ctx.request.user.id !== userId && ctx.request.user.is_admin !== 1)
    {
      ctx.response.status = 401;
      ctx.response.message = "Unauthorized.";
      throw new Error("404 Unauthorized.");
    }

    user.destroy();
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