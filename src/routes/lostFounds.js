const KoaRouter = require("koa-router");
const authMiddle = require("../middlewares/auth");
const cloudinary = require("../config/cloudinary");

const router = new KoaRouter();

// @route    GET api/lost-founds
// @desc     Get all lost-founds
// @access   Public
router.get("lost-founds.list", "/", async (ctx) => {
  try {
    // console.log("CTX: " + JSON.stringify(ctx));
    const lostFoundsList = await ctx.orm.lost_n_found.findAll();

    // handle not found
    if (!lostFoundsList) {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    ctx.body = lostFoundsList;
  } catch (err) {
    console.log(err);
  }
});

// @route    GET api/lost-founds/:id
// @desc     Get lost-founds by id
// @access   Public
router.get("lost-founds.view", "/:id", async (ctx) => {
  try {
    // console.log("CTX: " + JSON.stringify(ctx));

    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf("/");
    let lostFoundId = parseInt(url.substring(index + 1));

    const lostFound = await ctx.orm.lost_n_found.findByPk(lostFoundId);

    // handle not found
    if (!lostFound) {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    // send lost-found content
    ctx.body = lostFound;
  } catch (err) {
    console.log(err);
  }
});

// @route    POST api/lost-founds
// @desc     Create a new lost-found
// @access   Private
router.post("lost-founds.create", "/", authMiddle, async (ctx) => {

  try {

    // upload image to cloudinary and get path
    const values = Object.values(ctx.request.files);

    // const result = await cloudinary.v2.uploader.unsigned_upload(values[0].path, {eager: [{width: 400, height: 400, crop: "scale"}]});
    const result = await cloudinary.v2.uploader.upload(values[0].path, {eager: [{width: 400, height: 400, crop: "scale"}]});

    const path = result.eager[0].url;

    console.log(ctx.request.body);

    const lostFound = ctx.orm.lost_n_found.build(ctx.request.body);
    lostFound.userId = ctx.request.user.id;
    lostFound.picture = path;

    // No need to handle duplicates of any kind here
    await lostFound.save({
      fields: [
        "name",
        "description",
        "picture",
        "pickedBy_name",
        "pickedBy_mail",
        "pickedBy_phone",
        "userId",
      ],
    });

    console.log(lostFound.picture);
    ctx.response.status = 201;
    ctx.response.message = "Created";
    ctx.body = lostFound;
  } catch (err) {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    PUT api/lost-founds/:id
// @desc     Replace an existing lost-found
// @access   Private
router.put("lost-founds.update", "/:id", authMiddle, async (ctx) => {
  const newLostFound = ctx.orm.lost_n_found.build(ctx.request.body);

  try {
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf("/");
    let lostFoundId = parseInt(url.substring(index + 1));

    // Get current lost-found
    const lostFound = await ctx.orm.lost_n_found.findByPk(lostFoundId);

    // handle not found
    if (!lostFound) {
      ctx.response.status = 404;
      ctx.response.message = "Not found.";
      throw new Error("404 Not found.");
    }

    // Any authenticated user can modify lost-founds
    // so no need to check for ownership

    lostFound.name = newLostFound.name;
    lostFound.description = newLostFound.description;
    lostFound.picture = newLostFound.picture;
    lostFound.pickedBy_name = newLostFound.pickedBy_name;
    lostFound.pickedBy_mail = newLostFound.pickedBy_mail;
    lostFound.pickedBy_phone = newLostFound.pickedBy_phone;

    await lostFound.save();

    // send lost-found content
    ctx.response.status = 200;
    ctx.response.message = "OK";
    ctx.body = lostFound;
  } catch (err) {
    console.log(err);
    if (ctx.response.status === 404) {
      ctx.response.status = 500;
      ctx.response.message = "Internal server error.";
    }
  }
});

// @route    DEL api/lost-founds/:id
// @desc     Delete an existing lost-found
// @access   Private
router.del("lost-founds.delete", "/:id", authMiddle, async (ctx) => {
  try {
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf("/");
    let lostFoundId = parseInt(url.substring(index + 1));

    const lostFound = await ctx.orm.lost_n_found.findByPk(lostFoundId);

    // handle not found
    if (!lostFound) {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    // Any authenticated user can modify lost-founds
    // so no need to check for ownership

    lostFound.destroy();
    ctx.response.status = 200;
    ctx.response.message = "OK";
  } catch (err) {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

module.exports = router;
