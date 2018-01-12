const fs = require('fs');
const stampit = require('stampit');

module.exports = stampit({
  init (conf) {
    Object.assign(this, {
      getHandlerMessageObject () {
        let i18nPath = `${__dirname.replace('helpers', '')}/i18n/${conf.i18n}.handlerMessages.json`;
        return require(
          fs.existsSync(i18nPath) ?
            i18nPath :
            `../i18n/en.handlerMessages.json`);
      },

      injectHTMLWithMessage (html, messageName, message) {
        if (html && messageName && message) {
          const pattern = new RegExp(`#(${messageName})#`, 'g');
          return html.replace(pattern, (match, number) => {
            return message;
          });
        } else return '';
      },

      parseParams (echo, name) {
        return typeof echo === 'object' &&
          typeof name === 'string' &&
          echo.hasOwnProperty(name);
      }
    });
  }
});
