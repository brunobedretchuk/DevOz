const Router = require("koa-router");
const router = new Router();
const User = require("../models/User.js");
const { AvatarGenerator } = require("random-avatar-generator");

const generator = new AvatarGenerator();

//functions

let getIndex = async (ctx) => {
  await ctx.render("index", {});
  ctx.response.status = 200;
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
  userId = ctx.request.params.id;
  userFound = await User.findById(userId);
  avatar = generator.generateRandomAvatar(userFound.id);
  await ctx.render("userPage", {
    user: userFound,
    avatar: avatar,
  });
};

let postUser = async (ctx) => {
  try {
    const body = ctx.request.body;
    let user = new User(body);
    await user.save();

    ctx.redirect("/users");
  } catch (err) {
    ctx.response.status = 400;
    ctx.redirect("/");
  }
};

let patchUser = async (ctx) => {
  try {
    let id = ctx.params.id;
    let userUpdated = ctx.request.body;
    let user = await User.findByIdAndUpdate(id, userUpdated, {
      runValidators: true,
      new: true,
    });
    ctx.redirect("/users");
  } catch (err) {
    console.log(err.message);
    ctx.response.status = 400;
    ctx.redirect("/");
  }
};

let deleteUser = async (ctx) => {
  try {
    let id = ctx.params.id;
    let user = await User.findByIdAndDelete(id);
    ctx.redirect("/users");
  } catch (err) {
    console.log(err.message);
    ctx.response.status = 400;
    ctx.redirect("/");
  }
};

//get routes
router.get("/", getIndex);
router.get("/users", getUsers);
router.get("/register_user", getRegisterUser);
router.get("/users/:id", getUser);

//post route

router.post("/register_user", postUser);

//patch route

router.patch("/users/:id", patchUser);

//delete route

router.delete("/users/:id" , deleteUser)

module.exports = router;
