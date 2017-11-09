const getHandlerMessagePath = require('./getHandlerMessagesPath');

module.exports = function EchoHandler (echoObject, conf) {
  const msg = require(getHandlerMessagePath(conf));
  const getEcho = (name, ...args) => {
    try {
      const echo = echoObject;
      if (parseParams(echo, name)) {
        return echo[name].replace(/{(\d+)}/g, (match, number) => {
          return typeof args[number] !== 'undefined'
            ? args[number]
            : match;
        });
      } else throw new Error(`${msg['messageNotFound']} ${name}`);
    } catch (e) {
      return e.message;
    }
  };

  const parseParams = (echo, name) => {
    return typeof echo === 'object' &&
      typeof name === 'string' &&
      echo.hasOwnProperty(name);
  };

  ['log', 'error'].forEach(it => {
    this[it] = (name, ...args) => {
      conf.logger[it](getEcho(name, ...args));
    };
  });

  this.raw = (name, ...args) => {
    return getEcho(name, ...args);
  };

  this.throw = (name, ...args) => {
    throw ((conf.ExceptionClass)
      ? new conf.ExceptionClass(getEcho(name, ...args), conf.exceptionOptions)
      : new Error(getEcho(name, ...args)));
  };
};
