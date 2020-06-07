const KoaRouter = require("koa-router");
const authMiddle = require("../middlewares/auth");

const router = new KoaRouter();

// @route    GET api/messages
// @desc     Get all messages
// @access   Public
router.get("messages.list", "/", async (ctx) => {
  try {
    // console.log("CTX: " + JSON.stringify(ctx));
    const messagesList = await ctx.orm.message.findAll();
    // handle not found
    if (!messagesList) {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
      throw new Error("404 Not found.");
    }

    ctx.body = messagesList;
  } catch (err) {
    console.log(err);
  }
});

// @route    POST api/messages
// @desc     Create a new message
// @access   Private
router.post("messages.create", "/", authMiddle, async (ctx) => {
  const message = ctx.orm.message.build(ctx.request.body);
  message.userId = ctx.request.user.id;

  try {
    // No need to handle duplicates of any kind here
    await message.save({ fields: ["content", "user1", "user2"] });
    ctx.response.status = 201;
    ctx.response.message = "Created";
    ctx.body = message;
  } catch (err) {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

module.exports = router;
