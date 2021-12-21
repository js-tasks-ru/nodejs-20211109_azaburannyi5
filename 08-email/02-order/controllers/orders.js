const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.checkout = async function checkout(ctx, next) {

    let order = await Order.create({
        user: ctx.user._id,
        product: ctx.request.body.product,
        phone: ctx.request.body.phone,
        address: ctx.request.body.address
    });

    sendMail({
        to: ctx.user.email,
        subject: 'Ваш заказ',
        locals: {id: order.product._id, product: order.product},
        template: 'order-confirmation',
    });

    ctx.status = 200;  
    ctx.body = {'order': order};

    return next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {

    let orders = await Order.find({user: ctx.user});

    ctx.status = 200;  
    ctx.body = {'orders': orders};

    return next();
};
