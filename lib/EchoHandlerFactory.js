const stampit = require('stampit');

const EchoHandler = require('./EchoHandler');
const EchoHandlerFactoryHelper = require('./helpers/EchoHandlerFactoryHelper');

module.exports = stampit({
  init (conf) {
    const helper = EchoHandlerFactoryHelper(conf);
    const echo = helper.getDefaultEcho();

    function i18nRequirement (item, lang) {
      try {
        if (typeof lang === 'string' && lang.length === 2) {
          if (typeof conf.messageFolder === 'string') {
            switch (true) {
              case (typeof conf.regionalizer === 'function'):
                return require(`${conf.messageFolder}/${conf.regionalizer(item, lang)}.json`);
              case (typeof conf.regionalizer === 'undefined'):
                return require(`${conf.messageFolder}/${helper.defaultRegionalizer(item, lang)}.json`);
              default:
                echo.throw('regionalizerInvalid');
            }
          } else echo.throw('folderInvalid');
        } else echo.throw('i18nInvalid', lang);
      } catch (e) { echo.throw('failed', item + (e.message ? ': ' + e.message : '.')); }
    }

    ['log', 'error', 'raw', 'throw'].forEach((dummy) => {
      this[dummy] = (name, ...args) => helper.getDefaultEcho().throw('notInitialised', dummy);
    });

    Object.assign(this, {
      load (item, lang = conf.i18n) {
        return EchoHandler({ echoObject: i18nRequirement(item, lang), conf });
      }
    });
  }
});
