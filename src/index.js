//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev
const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const render = require('koa-ejs')
const bodyParser = require('koa-bodyparser')
require('dotenv').config()
const PORT = process.env.PORT;
const mongoose = require('mongoose')
const db = mongoose.connection;
const host = process.env.dbUrl
const dbupdate = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(host , dbupdate)

db.on("error" , (err)=> console.log('Error, DB not connected'))
db.on("connected" , ()=> console.log('Connected to mongo!'))
db.on("disconnected" , ()=> console.log('Mongo has disconnected'))
db.on("open" , (err)=> console.log('Conection made!'))


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
  await ctx.render('index' , {
    title: 'test'
  })
});

app
  .use(router.routes())
  .use(testeRouter.routes())
  .use(router.allowedMethods())
  .use(bodyParser());

const server = app.listen(PORT , ()=> console.log(`Listening in Port ${PORT}...`));
module.exports = server;