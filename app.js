var app = require('koa')(),
  logger = require('koa-logger'),
  json = require('koa-json'),
  views = require('koa-views'),
  onerror = require('koa-onerror'),
  session = require('koa-session')
var index = require('./routes/index');
var users = require('./routes/users');

var contentType = require('content-type')
var getRawBody = require('raw-body')

// error handler
onerror(app);

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'ejs'
}));


app.keys = ['this is myKoaBlog'];
app.use(session(app));


app.use(function* (next) {
  this.text = yield getRawBody(this.req, {
    length: this.req.headers['content-length'],
    limit: '1mb'
    // encoding: contentType.parse(this.req).parameters.charset
  })
  yield next
})



app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function* (next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

module.exports = app;