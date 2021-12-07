const Product = require('../models/Product');
const productMapper = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  let products = await Product.find({subcategory: subcategory});

  if (products.length != 0) {

    ctx.body = {
      products: products.map(product => productMapper(product))
    };
  
    return next();
  }
  
  await next();

  ctx.body = {
    products: []
  };
};

module.exports.productList = async function productList(ctx, next) {

  let products = await Product.find({});

  ctx.body = {
    products: products.map(product => productMapper(product))
  };

  return next();
};

module.exports.productById = async function productById(ctx, next) {

  const {id} = ctx.params;

  let product = await Product.findById(id);

  if (!product) return next();

  ctx.body = {
    product: productMapper(product)
  };

  return next();
};

