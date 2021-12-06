const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = {};

router.get('/subscribe', async (ctx, next) => {

    let id = Math.random();

    subscribers[id] = null;

    ctx.body = await new Promise(resolve => {
        let interval = setInterval(() => {
            if (subscribers[id] != null) {
                let message = subscribers[id];
                clearInterval(interval);
                delete subscribers[id]

                resolve(message)
            }

        }, 10)
    });

    return next();

});

router.post('/publish', async (ctx, next) => {

    if (ctx.request.body.message) {
        for (const [key, value] of Object.entries(subscribers)) {
            subscribers[key] = ctx.request.body.message;
        }
    }

    ctx.body = ctx.request.body.message;

    return next();
});

app.use(router.routes());

module.exports = app;
