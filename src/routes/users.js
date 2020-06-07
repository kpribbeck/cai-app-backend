const KoaRouter = require('koa-router');
const authMiddle = require('../middlewares/auth');

const router = new KoaRouter();


// @route    GET api/users
// @desc     Get all users
// @access   Private
router.get('users.list', '/', authMiddle, async (ctx) =>
{
  try
  {
    // console.log("CTX: " + JSON.stringify(ctx));
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

// @route    GET api/users/requests/:active_state  (pending / active / rejected)
// @desc     Get all users
// @access   Private
router.get('users.list', '/requests/:is_active', authMiddle, async (ctx) =>
{
  try
  {
    // console.log("CTX: " + JSON.stringify(ctx));

    // finds state from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let state = parseInt(url.substring(index + 1));
    state = parseInt(state);

    const usersList = await ctx.orm.user.findAll({
      where: {
        is_active: state
      }
    });
    
    // handle not found
    if (!usersList)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      return;
    }

    ctx.body = usersList;
  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    GET api/users/:id
// @desc     Get user by id
// @access   Private
router.get('users.view', '/:id', authMiddle, async (ctx) => 
{
  try
  {
    // console.log("CTX: " + JSON.stringify(ctx));
    
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

// @route    GET api/users/requests/accept/:id
// @desc     Activate an existing user request
// @access   Private
router.get('users.update', '/requests/accept/:id', authMiddle, async (ctx) => {

  try
  {
    if (ctx.request.user.is_admin !== 1)
    {
      ctx.response.status = 401;
      ctx.response.message = "Unauthorized.";
      return;
    }

    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let userId = parseInt(url.substring(index + 1));

    const user = await ctx.orm.user.findByPk(userId);   

    // handle not found
    if (!user)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found.";
      return;
    }

    user.is_active = 1;

    await user.save();

    // send user content
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

// @route    GET api/users/requests/reject/:id
// @desc     Reject an existing user request
// @access   Private
router.get('users.update', '/requests/reject/:id', authMiddle, async (ctx) => {

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
      ctx.response.message = "Not found.";
      return;
    }

    user.is_active = 0;

    await user.save();

    // send user content
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