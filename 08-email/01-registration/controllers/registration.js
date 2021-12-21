const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    
    const verificationToken = uuid();

    let user = new User({
        email: ctx.request.body.email, 
        displayName: ctx.request.body.displayName,
        verificationToken: verificationToken
    });

    await user.setPassword(ctx.request.body.password);
    await user.save();

    sendMail({
        to: user.email,
        subject: 'Подтвердите почту',
        template: 'confirmation',
        locals: {token: verificationToken},
    });

    ctx.status = 200;
    ctx.body = {"status": "ok"};

    return next();
};

module.exports.confirm = async (ctx, next) => {

    const verificationToken = ctx.request.body.verificationToken;

    let user = await User.findOne({verificationToken: verificationToken})

    if(!user) {
        ctx.throw(404, 'Ссылка подтверждения недействительна или устарела');
        ctx.status = 404;
        ctx.body = 'Ссылка подтверждения недействительна или устарела';

        return next();
    }

    ctx.status = 200;
    ctx.body = {"token": verificationToken};

    user.verificationToken = undefined;
    user.save();     

    return next();
}
