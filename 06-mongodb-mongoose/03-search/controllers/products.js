const productMapper = require('../../02-rest-api/mappers/product');
const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {

  let {query} = ctx.query;

  let products = await Product.find({ $text : { $search : query }})

  if (products.length != 0) {
    
    ctx.body = {products: products.map(product => productMapper(product))};

    return next();
  }

  ctx.body = {products: []};

  return next();
};
