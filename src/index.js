//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const render = require('koa-ejs')
const bodyParser = require('koa-bodyparser')
require('dotenv').config()
const PORT = process.env.PORT;
const router = new Router;

//DB Connection Setup
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

// ejs render configs
render(app , {
  root: path.join(__dirname , 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false
})
// Routes Imports
mainRouter =  require('./routes/main')
//Routes Use
app
  .use(mainRouter.routes())
  .use(router.allowedMethods())
  .use(bodyParser());

const server = app.listen(PORT , ()=> console.log(`Listening in Port ${PORT}...`));
module.exports = server;