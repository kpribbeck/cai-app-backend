const jwt = require("jsonwebtoken");
const config = require("../config/config.json");

// module.exports = function(req, res, next) {
module.exports = async function(ctx, next) {

  const default_secret = config.secretOrKey;
  const secret = `${process.env.JWT_SECRET || default_secret}`;

  // console.log("Middle CTX: " + JSON.stringify(ctx.request));
  // console.log("HEADER: " + JSON.stringify(ctx.request.header));
  // console.log("Authorization: " + ctx.request.header.authorization);
  // if (ctx.request.header.authorization)
  //   console.log("TOKEN: " + ctx.request.header.authorization.split(' ')[1]);

  
  let token = null;
  
  // Get token from header
  if (ctx.request.header.authorization)
    token = ctx.request.header.authorization.split(' ')[1];

  // Check if no token
  if (!token) {
    ctx.response.status = 401;
    ctx.response.message = "No token, unauthorized";
    return;
    // return res.status(401).json({ message: "No token, unauthorized" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, secret);

    ctx.request.user = decoded.user;
    await next();
  } catch (err) {
    ctx.response.status = 401;
    ctx.response.message = "Token is not valid";
    // res.status(401).json({ message: "Token is not valid" });
  }
};
