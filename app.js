const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const index = require('./routes/index')
const users = require('./routes/users')
const mongoose = require("mongoose");
// error handler
onerror(app)

// middlewares
app.use(
    bodyparser({
        enableTypes: ['json', 'form', 'text']
    })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
    views(__dirname + '/views', {
        map: { html: 'ejs' }
    })
)

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})


mongoose.connect("mongodb://127.0.0.1:27017/tmsf");

mongoose.connection.on("connected", function() {
    console.log("数据库连接成功");
});

mongoose.connection.on("error", function() {
    console.log("数据库连接连接失败");
});

mongoose.connection.on("disconnected", function() {
    console.log("数据库连接连接断开");
});

global.trim = function(str){
    return str.replace(/(^\s*)|(\s*$)/g,'')
}

module.exports = app

