
module.exports = function EchoHandler (echoObject, conf) {
  const msg = require(`./i18n/${conf.i18n}.handlerMessages.json`);
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

  this.log = (name, ...args) => {
    conf.logger.log(getEcho(name, ...args));
  };
  this.raw = (name, ...args) => {
    return getEcho(name, ...args);
  };
  this.throw = (name, ...args) => {
    throw new Error(getEcho(name, ...args));
  };
};
