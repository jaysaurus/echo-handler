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
      regionalizer: (item, language) => {
        return item.replace(
          /([a-z\d._-]+$)/gi,
          (match, fileName) => { return `${language}.${fileName}`; });
      }
    };

    let conf = Object.assign(parentOps, validateClientOptions(clientOptions));
    return new EchoHandlerFactory(conf);
  }
};
