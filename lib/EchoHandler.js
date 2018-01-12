const stampit = require('stampit');

const CustomError = require('./CustomError');
const EchoHandlerHelper = require('./helpers/EchoHandlerHelper');

module.exports = stampit({
  init ({ echoObject, conf }) {
    const helper = EchoHandlerHelper(conf);
    const message = helper.getHandlerMessageObject();

    function getEcho (name, ...args) {
      try {
        const echo = echoObject;
        if (helper.parseParams(echo, name)) {
          return echo[name].replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== 'undefined'
              ? args[number]
              : match;
          });
        } else throw new Error(`${message['messageNotFound']} ${name}`);
      } catch (e) {
        return e.message;
      }
    }

    Object.assign(this, {
      'error' (name, ...args) {
        conf.logger.error(getEcho(name, ...args));
      },

      'log' (name, ...args) {
        conf.logger.log(getEcho(name, ...args));
      },

      'raw' (name, ...args) {
        return getEcho(name, ...args);
      },

      'throw' (def, ...args) {
        if (typeof def === 'object') {
          const message = getEcho(def.message, ...args);
          throw CustomError(
            Object.assign({}, def, {
              message,
              htmlMessage: helper.injectHTMLWithMessage(def.htmlMessage, def.message, message)
            }));
        } else {
          throw ((conf.ExceptionClass)
            ? new conf.ExceptionClass(getEcho(def, ...args), conf.exceptionOptions)
            : new Error(getEcho(def, ...args)));
        }
      }
    });
  }
});
