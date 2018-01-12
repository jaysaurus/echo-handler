const stampit = require('stampit');

const EchoHandler = require('../EchoHandler');
const EchoHandlerHelper = require('./EchoHandlerHelper');

module.exports = stampit(EchoHandlerHelper, {
  init (conf) {
    Object.assign(this, {
      defaultRegionalizer (item, language) {
        return item.replace(
          /([a-z\d._-]+$)/gi,
          (match, fileName) => { return `${language}.${fileName}`; });
      },

      getDefaultEcho () {
        const defaultRegionalizer = this.defaultRegionalizer;
        return EchoHandler({
          echoObject: this.getHandlerMessageObject(),
          conf: Object.assign({}, conf, { defaultRegionalizer }) });
      }
    });
  }
});
