const EchoHandlerFactory = require('../lib/EchoHandlerFactory');

jest.mock(
  `../i18n/a/b/c/en.FakeMessages.json`,
  () => { return { "test": "this is a test message" }; },
  { virtual: true });

describe('EchoHandlerFactory Test', () => {
  const mockLogger = spy => {
    return {
      log: message => { spy.push(message) }
    };
  }

  let spy = [];
  let conf = {
    i18n: 'en',
    logger: mockLogger(spy),
    messageFolder: '../i18n',
    regionalizer: (item, language) => {
      return item.replace(
        /([a-z\d._-]+$)/gi,
        (match, fileName) => { return `${language}.${fileName}`; });
    }
  };

  test('EchoHandlerFactory initialises and will return an EchoHandler from 4 namespaces deep on init', () => {
    const echoFactory = new EchoHandlerFactory(conf);
    expect(echoFactory.load('a/b/c/FakeMessages').raw('test')).toBe('this is a test message');
  });

  test('EchoHandlerFactory will throw an exception if the i18n object is too long', () => {
    const echoFactory = new EchoHandlerFactory(conf);
    try {
      echoFactory.load('a/b/c/FakeMessages', 'duff')
    } catch (e) {
      expect(e.message).toMatch('Failed to load a/b/c/FakeMessages');
      expect(e.message).toMatch('the i18n region code \"duff\" is invalid.  An i18n region code must be a 2 letter string.')
    }
  });

  test('EchoHandlerFactory will throw an exception if the user tries to call EchoHandler methods on factory', () => {
    const echoFactory = new EchoHandlerFactory(conf);
    ['log', 'raw', 'throw'].forEach(dummy => {
      try {
        echoFactory[dummy]('mock', 'mock')
      } catch (e) {
        expect(e.message).toMatch('uninitialised echo-handler call detected. Your definition must be initialised first: echo.init(\'someMessagesFile\')');
      }
    });
  });

  test('EchoHandlerFactory will throw an exception if the regionalizer is not a function', () => {
    conf.regionalizer = 'BROKEN'
    const echoFactory = new EchoHandlerFactory(conf);
    try {
      echoFactory.load('a/b/c/FakeMessages')
    } catch (e) {
      expect(e.message).toMatch('Failed to load a/b/c/FakeMessages:');
      expect(e.message).toMatch('the supplied regionalizer is invalid, it must be a function with 2 arguments.')
    }
  });

  test('EchoHandlerFactory will throw an exception if something unexpected happens', () => {
    conf.regionalizer = () => { throw new Error(); }
    const echoFactory = new EchoHandlerFactory(conf);
    try {
      echoFactory.load('a/b/c/FakeMessages')
    } catch (e) {
      expect(e.message).toMatch('Failed to load a/b/c/FakeMessages.');
    }
  });
});
