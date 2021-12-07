const Koa = require('koa');
const Router = require('koa-router');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.path == '_id') {
      ctx.status = 400;
      ctx.body = {error: 'Invalid `id` parameter'};

      return;
    }

    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};

      return;
    }

    ctx.status = 500;
    ctx.body = {error: 'Internal server error'};

    return;
  }
});

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);

app.use(router.routes());

module.exports = app;
