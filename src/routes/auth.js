const KoaRouter = require("koa-router");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config.json");
const authMiddle = require("../middlewares/auth");
const { Op } = require("sequelize");

const router = new KoaRouter();

const default_secret = config.secretOrKey;
const secret = `${process.env.JWT_SECRET || default_secret}`;

function ValidateUserData(data, errors, checkPassword) {
  // console.log("data: " + JSON.stringify(data));

  // ['mail', 'password', 'name', 'last_name', 'student_number', 'contact_number', 'picture', 'job', 'is_admin']

  // if (!(/^[\-0-9a-zA-Z\.\+_]+@[-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(data.mail))) {
  if (
    !/^[-0-9a-zA-Z\._]+@[-0-9a-zA-Z\._]+\.[a-zA-Z]{2,}$/.test(String(data.mail))
  ) {
    errors.email = ["Email is not valid."];
  }

  if (checkPassword === 1) {
    if (String(data.password).trim().length < 6) {
      errors.password = ["Password must be at least 6 characters long."];
    }
  }

  if (!String(data.name).trim()) {
    errors.name = ["Name is required."];
  }

  if (!String(data.last_name).trim()) {
    errors.last_name = ["Last name is required."];
  }

  if (!/^[0-9]{7}[a-zA-Z0-9]$/.test(String(data.student_number).trim())) {
    errors.student_number = ["Student number is not valid."];
  }

  if (!/\+?[0-9]+$/.test(String(data.contact_number).trim())) {
    errors.contact_number = ["Contact number is not valid."];
  }
  // console.log(errors);

  return errors;
}

// @route    POST api/auth/sign-up
// @desc     Register a new user
// @access   Public
router.post("users.create", "/sign-up", async (ctx) => {
  const data = ctx.request.body;
  let errors = {};
  // console.log(JSON.stringify(ctx));
  // console.log("data: " + JSON.stringify(data));

  try {
    // Validate user data
    // Returns an object with errors, empty object if OK
    errors = ValidateUserData(data, errors, 1);

    // If any error was found, throw
    if (Object.keys(errors).length) {
      ctx.response.status = 400;
      ctx.response.message = "Bad Request";
      ctx.response.body = { ...errors };
      return;
    }

    const newUser = ctx.orm.user.build(ctx.request.body);

    // Check for user uniqueness
    let foundDuplicate = await ctx.orm.user.findAll({
      where: { mail: newUser.mail },
    });

    if (foundDuplicate.length !== 0) {
      // Throw error, Conflict: User already exists
      ctx.response.status = 409;
      ctx.response.message = "Conflict. User already exists.";
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    // Forbid the existence of two admins
    if (newUser.is_admin == 1) {
      // Search for existing admin
      let foundAdmin = await ctx.orm.user.findAll({
        where: { is_admin: 1 },
      });

      if (foundAdmin.length !== 0) {
        // If found, throw err: Forbidden
        ctx.response.status = 403;
        ctx.response.message = "Forbidden";
        return;
      }
    }

    // User registration must be accepted by admin. is_active attribute determines wether a user has been activated.
    // is_active = -1 / 0 / 1
    // -1 = pending
    // 0 = denied
    // 1 = accepted
    // Only admin should not create a request (is_active = 1 automatically)
    newUser.is_admin = parseInt(newUser.is_admin);
    switch (newUser.is_admin) {
      case 1:
        newUser.is_active = 1;

        await newUser.save({
          fields: [
            "mail",
            "password",
            "name",
            "last_name",
            "student_number",
            "contact_number",
            "picture",
            "job",
            "is_admin",
            "is_active",
          ],
        });

        // Send user as payload
        const payload = {
          user: {
            id: newUser.id,
            mail: newUser.mail,
            name: newUser.name,
            last_name: newUser.last_name,
            is_admin: newUser.is_admin,
          },
        };

        // Sign JWT
        // Send back token
        const token = jwt.sign(
          payload,
          secret,
          { expiresIn: 60 * 60 * 24 } // expires in 24hrs
        );

        payload.token = token;

        ctx.response.body = payload;
        ctx.response.status = 201;
        ctx.response.message = "Successfuly created new user.";
        break;

      case 0:
        newUser.is_active = -1; // (pending)

        await newUser.save({
          fields: [
            "mail",
            "password",
            "name",
            "last_name",
            "student_number",
            "contact_number",
            "picture",
            "job",
            "is_admin",
            "is_active",
          ],
        });

        ctx.response.status = 201;
        ctx.response.message = "Successfuly created new user.";
        break;

      default:
        // console.log(newUser.is_admin);
        // console.log(typeof(newUser.is_admin));
        throw new Error();
    }
  } catch (err) {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route   POST api/auth/log-in
// @desc    Authenticate user and get token
// @access  Public
router.post("users.auth", "/log-in", async (ctx) => {
  const data = ctx.request.body;
  let errors = {};
  // console.log(JSON.stringify(data));

  try {
    // See if user already exists
    const existingUser = await ctx.orm.user.findOne({
      where: { mail: data.mail.trim() },
    });
    if (!existingUser) {
      // No user found
      ctx.response.status = 400;
      ctx.response.message = "Invalid Credentials. User does not exist.";
      return;
    }

    // Check that user is active
    if (existingUser.is_active !== 1) {
      ctx.response.status = 401;
      ctx.response.message = "Unauthorized.";
      return;
    }

    // Make sure password match
    const isMatch = await bcrypt.compare(data.password, existingUser.password);

    if (!isMatch) {
      ctx.response.status = 400;
      ctx.response.message = "Invalid Credentials. Incorrect password.";
      return;
    }

    // Send user as payload
    const payload = {
      user: {
        id: existingUser.id,
        mail: existingUser.mail,
        name: existingUser.name,
        last_name: existingUser.last_name,
        is_admin: existingUser.is_admin,
      },
    };

    // Sign JWT
    // Send back token
    const token = jwt.sign(
      payload,
      secret,
      { expiresIn: 60 * 60 * 24 } // expires in 24hrs
    );

    payload.token = token;

    ctx.response.body = payload;
    ctx.response.status = 200;
    ctx.response.message = "Successfuly created new user.";
  } catch (err) {
    console.error(err.message);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

// @route    PUT api/auth/:id
// @desc     Replace an existing user
// @access   Private
router.put("users.update", "/:id", authMiddle, async (ctx) => {
  try {
    
    //// Get existing user by id and validate authentication
    // finds id from the request url
    const url = ctx.request.url;
    let index = url.lastIndexOf("/");
    let userId = parseInt(url.substring(index + 1));

    const user = await ctx.orm.user.findByPk(userId);

    // handle not found
    if (!user) {
      ctx.response.status = 404;
      ctx.response.message = "Not found.";
      return;
    }

    // check that user.id matches requester's id
    if (ctx.request.user.id !== userId) {
      ctx.response = 401;
      ctx.response.message = "Unauthorized.";
      return;
    }

    //// Get and validate form
    const newUserData = ctx.request.body;
    let errors = {};
    let changePassword;
    // console.log("UserData: ");
    // console.log(newUserData);
    // console.log(newUserData.password);

    if (newUserData.password === undefined) changePassword = 0;
    else changePassword = 1;

    // Validate user data
    // Returns an object with errors, empty object if OK
    errors = ValidateUserData(newUserData, errors, changePassword);

    // If any error was found, throw
    if (Object.keys(errors).length) {
      ctx.response.status = 400;
      ctx.response.message = "Bad Request";
      ctx.response.body = { ...errors };
      return;
    }

    // Check for user uniqueness
    let foundDuplicate = await ctx.orm.user.findAll({
      where: {
        mail: newUserData.mail,
        id: {
          [Op.ne]: userId,
        },
      },
    });

    if (foundDuplicate.length !== 0) {
      // Throw error, Conflict: User already exists
      ctx.response.status = 409;
      ctx.response.message = "Conflict. User already exists.";
      return;
    }

    //// Make Changes and Save
    user.mail = newUserData.mail;
    user.name = newUserData.name;
    user.last_name = newUserData.last_name;
    user.student_number = newUserData.student_number;
    user.contact_number = newUserData.contact_number;
    user.job = newUserData.job;

    // Change password only if new password is specified.
    if (changePassword === 1) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      newUserData.password = await bcrypt.hash(newUserData.password, salt);

      user.password = newUserData.password;
    }

    await user.save();

    // send user content
    ctx.response.status = 201;
    ctx.response.message = "Edited.";
    ctx.body = user;
  } catch (err) {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.message = "Internal server error.";
  }
});

module.exports = router;
