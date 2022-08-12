//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

// todas as configuraçoes devem ser passadas via environment variables
const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const render = require('koa-ejs')
const bodyParser = require('koa-bodyparser')
require('dotenv').config()
const PORT = process.env.PORT;

const app = new Koa();
var router = new Router();

// Routes Imports
testeRouter =  require('./routes/teste')
//Routes Use
app.use(router.routes())

// ejs render configs
render(app , {
  root: path.join(__dirname , 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false

})

//rota simples pra testar se o servidor está online
router.get('/', async (ctx) => {
  await ctx.render('index')
});

app
  .use(router.routes())
  .use(testeRouter.routes())
  .use(router.allowedMethods())
  .use(bodyParser());

const server = app.listen(PORT , ()=> console.log(`Listening in Port ${PORT}...`));
module.exports = server;