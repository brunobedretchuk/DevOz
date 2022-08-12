const Router = require('koa-router');
const router = new Router()
const User = require('../models/User.js')

router.get('/teste', async (ctx) => {
  let users = await User.find();
  console.log(users)
  await ctx.render('index' , {
    
  })
})

module.exports =  router