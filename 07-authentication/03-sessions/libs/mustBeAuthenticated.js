const Session = require('../models/Session');

module.exports = async function mustBeAuthenticated(ctx, next) {

  if(ctx.user == undefined) {
    ctx.throw(401, 'Пользователь не залогинен');
  }

  return next();
};
