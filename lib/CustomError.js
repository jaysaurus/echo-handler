const captureStackTrace = require('capture-stack-trace');
const stampit = require('stampit');

const CustomError = stampit({
  init (obj) {
    const _this = this;
    Object.keys(obj).forEach(function (key) {
      _this[key] = obj[key];
    });
    captureStackTrace(this);
  }
});

module.exports = CustomError;
