const defaultRegionalizer = require('./lib/defaultRegionalizer');
const EchoHandlerFactory = require('./lib/EchoHandlerFactory');
const EchoHandler = require('./lib/EchoHandler');

function validateClientOptions (opts) {
  return typeof opts === 'object' ? opts : {};
}
module.exports = {
  configure: (clientOptions) => {
    let parentOps = {
      i18n: 'en',
      logger: console,
      messageFolder: undefined,
      factoryOverride: undefined,
      regionalizer: defaultRegionalizer
    };

    let conf = Object.assign(parentOps, validateClientOptions(clientOptions));
    return (!conf.factoryOverride || typeof conf.factoryOverride !== 'string')
      ? new EchoHandlerFactory(conf)
      : new EchoHandler(require(conf.factoryOverride), conf);
  }
};
