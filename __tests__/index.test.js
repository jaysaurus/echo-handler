var index = require('../index');

jest.mock(
  `../i18n/a/b/c/en.FakeMessages.json`,
  () => { return { "test": "this is a test message" }; },
  { virtual: true });

  describe('index Test', () => {
    test('that EchoHandlerFactory is instantiated and returned', () => {
      let echoHandlerFactory = index.configure({ messageFolder: '../i18n' });
      let echo = echoHandlerFactory.load('a/b/c/FakeMessages');

      expect(echo.raw('test')).toBe('this is a test message');
    })

    test('that EchoHandlerFactory is instantiated and returned with default configuration', () => {
      let echoHandlerFactory = index.configure();
      try {
        echoHandlerFactory.load('a/b/c/FakeMessages');
      } catch (e) {
        expect(e.message).toMatch('echo-handler\'s messageFolder configuration property is missing or invalid.');
      }
    });

    test('that the factoryOverride property will return a raw echoHandler', () => {
      let rawEcho = index.configure({ factoryOverride: './i18n/a/b/c/en.FakeMessages.json' });
      expect(rawEcho.raw('test')).toBe('this is a test message');
    })
  });
