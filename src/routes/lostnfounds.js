const KoaRouter = require('koa-router');
const authMiddle = require('../middlewares/auth');

const router = new KoaRouter();


// @route    GET api/lost_n_founds
// @desc     Get all lost_n_founds
// @access   Public
router.get('lost_n_founds.list', '/', async (ctx) =>
{
  try
  {
    console.log("CTX: " + JSON.stringify(ctx));
    const lnfList = await ctx.orm.lostandfound.findAll();
    
    // handle not found
    if (!lnfList)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    ctx.body = lnfList;
  }
  catch(err)
  {
    console.log(err);
  }
});

// @route    GET api/lost_n_founds/:id
// @desc     Get lost_n_found by id
// @access   Public
router.get('lost_n_founds.view', '/:id', async (ctx) => 
{
  try
  {
    console.log("CTX: " + JSON.stringify(ctx));
    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let lnfId = parseInt(url.substring(index + 1));

    const lnf = await ctx.orm.lostandfound.findByPk(lnfId);
    
    // handle not found
    if (!lnf)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    // send lnf content
    ctx.body = lnf;

  }
  catch(err)
  {
    console.log(err);
  }
})


// @route    POST api/lost_n_founds 
// @desc     Create a new lnf
// @access   Private
router.post('lost_n_founds.create', '/', authMiddle, async (ctx) => {

  const lnf = ctx.orm.lostandfound.build(ctx.request.body);
  lnf.userId = ctx.request.user.id;
  console.log("New lnf: " + JSON.stringify(lnf));

  try
  {
    // No need to handle duplicates of any kind here
    await lnf.save({ fields: ['name', 'description', 'picture', 'pickedBy_name', 'pickedBy_mail', 'pickedBy_phone', 'userId'] });
    ctx.response.status = 201;
    ctx.response.message = "Created";
    ctx.body = lnf;
  }
  catch(err)
  {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    PUT api/lost_n_founds/:id
// @desc     Replace an existing lnf
// @access   Private
router.put('lost_n_founds.update', '/:id', authMiddle, async (ctx) => {
  const newLnf = ctx.orm.lostandfound.build(ctx.request.body);

  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let lnfId = parseInt(url.substring(index + 1));

    // Get current lnf
    const lnf = await ctx.orm.lostandfound.findByPk(lnfId);

    // handle not found
    if (!lnf)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found.";
      throw new Error("404 Not found.");
    }

    lnf.name = newLnf.name;
    lnf.description = newLnf.description;
    lnf.picture = newLnf.picture;
    lnf.pickedBy_name = newLnf.pickedBy_name;
    lnf.pickedBy_mail = newLnf.pickedBy_mail;
    lnf.pickedBy_phone = newLnf.pickedBy_phone;

    await lnf.save();

    // send lnf content
    ctx.response.status = 200;
    ctx.response.message = "OK";
    ctx.body = lnf;

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

// @route    DEL api/lost_n_founds/:id 
// @desc     Delete an existing lnf
// @access   Private
router.del('lost_n_founds.delete', '/:id', authMiddle, async (ctx) => {
  try
  {    
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf('/');
    let lnfId = parseInt(url.substring(index + 1));

    const lnf = await ctx.orm.lostandfound.findByPk(lnfId);
    
    // handle not found
    if (!lnf)
    {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    lnf.destroy();
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