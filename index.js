const defaultRegionalizer = require('./lib/defaultRegionalizer');
const EchoHandlerFactory = require('./lib/EchoHandlerFactory');

function validateClientOptions (opts) {
  return typeof opts === 'object' ? opts : {};
}
module.exports = {
  configure: (clientOptions) => {
    let parentOps = {
      i18n: 'en',
      logger: console,
      messageFolder: undefined,
      regionalizer: defaultRegionalizer
    };

    let conf = Object.assign(parentOps, validateClientOptions(clientOptions));
    return new EchoHandlerFactory(conf);
  }
};
