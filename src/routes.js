const KoaRouter = require("koa-router");

const index = require("./routes/index");
const stories = require("./routes/stories");
const events = require("./routes/events");
const objects = require("./routes/objects");
const users = require("./routes/users");
const proyects = require("./routes/proyects");
const auth = require("./routes/auth");
const lostFounds = require("./routes/lostFounds");
const messages = require("./routes/messages");

const router = new KoaRouter();

router.use("/", index.routes());
router.use("/stories", stories.routes());
router.use("/events", events.routes());
router.use("/objects", objects.routes());
router.use("/users", users.routes());
router.use("/proyects", proyects.routes());
router.use("/auth", auth.routes());
router.use("/lost-founds", lostFounds.routes());
router.use("/messages", messages.routes());

module.exports = router;
