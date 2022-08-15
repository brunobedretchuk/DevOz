const Router = require("koa-router");
const router = new Router();
const User = require("../models/User.js");
const { AvatarGenerator } = require("random-avatar-generator");

const generator = new AvatarGenerator();

//functions

let getIndex = async (ctx) => {
  try {
    await ctx.render("index", {});
    ctx.response.status = 200;
  } catch (err) {
    console.log(error.message);
    ctx.response.status = 200;
  }
};

let getUsers = async (ctx) => {
  try {
    const users = await User.find({});
    await ctx.render("allUsers", {
      userList: users,
    });
  } catch (e) {
    console.log(e);
  }
};
let getRegisterUser = async (ctx) => {
  await ctx.render("newUser", {});
};

let getUser = async (ctx) => {
  try {
    userId = ctx.request.params.id;
    userFound = await User.findById(userId);
    avatar = generator.generateRandomAvatar(userFound.id);
    await ctx.render("userPage", {
      user: userFound,
      avatar: avatar,
    });
  } catch (err) {
    ctx.response.status = 404;
    console.log(ctx.response.status);
  }
};

let postUser = async (ctx) => {
  try {
    const body = ctx.request.body;
    let user = new User(body);
    ctx.response.status = 201;
    await user.save();
    ctx.response.body = "User Created!";
  } catch (err) {
    ctx.response.text =
      "Desculpe, ocorreu um erro! Usuário já existe no banco ou foi requisitado como menor de idade!";
    ctx.response.status = 400;
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

let notFound = async (ctx) => {
  ctx.response.status = 404;
  ctx.response.body = "Page not Found";
};

//get routes
router.get("/", getIndex);
router.get("/users", getUsers);
router.get("/register_user", getRegisterUser);
router.get("/users/:id", getUser);
router.get("/:anything", notFound);

//post route

router.post("/register_user", postUser);

//patch route

router.patch("/users/:id", patchUser);

//delete route

router.delete("/users/:id", deleteUser);

module.exports = router;
