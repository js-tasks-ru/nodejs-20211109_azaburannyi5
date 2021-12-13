const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = new Set();

router.get('/subscribe', async (ctx, next) => {

    ctx.body = await new Promise(resolve => {
        subscribers.add(resolve);
        ctx.res.on('close', () => {
            subscribers.delete(resolve);
            resolve();
        });
    });

    return next();

});

router.post('/publish', async (ctx, next) => {

    if (!ctx.request.body.message) {
        ctx.throw(400, 'Empty message');
    }

    subscribers.forEach(resolve => resolve(ctx.request.body.message));

    ctx.body = ctx.request.body.message;

    return next();
});

app.use(router.routes());

module.exports = app;
