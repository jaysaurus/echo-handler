const EchoHandlerFactory = require('./lib/EchoHandlerFactory');
const EchoHandler = require('./lib/EchoHandler');

function validateClientOptions (opts) {
  return typeof opts === 'object' ? opts : {};
}

module.exports = {
  configure: (clientOptions) => {
    let parentOps = {
      factoryOverride: undefined,
      i18n: 'en',
      logger: console,
      messageFolder: undefined,
      regionalizer: undefined
    };

    let conf = Object.assign(parentOps, validateClientOptions(clientOptions));
    return (!conf.factoryOverride || typeof conf.factoryOverride !== 'string')
      ? EchoHandlerFactory(conf)
      : EchoHandler({ echoObject: require(conf.factoryOverride), conf });
  }
};
