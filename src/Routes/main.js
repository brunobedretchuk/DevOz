const Router = require("koa-router");
const router = new Router();
const User = require("../models/User.js");

//functions

let getIndex = async (ctx) => {
  await ctx.render("index", {});
  ctx.response.status = 200
};

let getUsers = async (ctx) => {
  const users = await User.find();
  await ctx.render("allUsers", {
    userList: users,
  });
};
let getRegisterUser = async (ctx) => {
  await ctx.render("newUser", {});
};

let getUser = async (ctx) => {
  await ctx.render("index", {});
};

let postUser = async (ctx) => {
  try {
    const body = ctx.request.body;
    let user = new User(body);
    await user.save()

    ctx.redirect("/users");
  } catch (err) {
    ctx.response.status = 400
    ctx.redirect('/')

  }
};

//get routes
router.get("/", getIndex);
router.get("/users", getUsers);
router.get("/register_user", getRegisterUser);
router.get("/users/:id", getUser);

//post route

router.post("/register_user", postUser);

module.exports = router;
