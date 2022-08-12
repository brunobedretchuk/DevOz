const Router = require('koa-router');
const router = new Router()
const User = require('../models/User.js')

router.get('/', async (ctx) => {
  await ctx.render('index' , {
  })
})

router.get('/users', async (ctx) => {
    const users = await User.find()
    console.log(users)
    await ctx.render('allUsers' , {
        userList: users
    })
  })

router.get('/new', async (ctx) => {
    await ctx.render('index' , {
    })
  })

router.get('/users/:username', async (ctx) => {
    await ctx.render('index' , {
    })
  })

module.exports =  router