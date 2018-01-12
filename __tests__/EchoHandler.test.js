const EchoHandler = require('../lib/EchoHandler');

describe('EchoHandler integration tests', () => {
  const mockLogger = spy => {
    return {
      log: message => { spy.push(message) },
      error: message => { spy.push(message) }
    };
  }

  test ('valid item returns respective raw string, log/error output and exception object', () => {
    let spy = [];
    let errorSpy = [];
    let conf = { i18n: 'en', logger: mockLogger(spy) };
    const echoObject = { 'test': 'Test Message returned with: {0}, {1} and {2}' };
    const echo = EchoHandler({ echoObject, conf });
    const message = 'Test Message returned with: a, b and c';

    expect(echo.raw('test', 'a', 'b', 'c')).toBe(message);

    echo.log('test', 'a', 'b', 'c');
    expect(spy[0]).toBe(message);

    echo.error('test', 'a', 'b', 'c');
    expect(spy[0]).toBe(message);

    let thrown = '';
    try { echo.throw('test', 'a', 'b', 'c'); }
    catch (e) { thrown = e.message; }
    expect(thrown).toBe(message);

    // edge case for where arguments are expected but undefined
    expect(echo.raw('test')).toBe(echoObject.test);
  });


  test ('custom exception thrown', () => {
    const spy = [];
    const conf = {
      i18n: 'en',
    };
    const echoObject = { 'test': 'test message with {0}' };
    const echo = EchoHandler({ echoObject, conf });

    try {
      echo.throw({
        name: 'MockException',
        level: 'Mock',
        message: 'test',
        htmlMessage: '<div>#test#</div>'
      }, 'a variable argument');
    } catch (e) {
      expect(e.message).toBe('test message with a variable argument');
      expect(e.htmlMessage).toBe('<div>test message with a variable argument</div>');
      expect(e.stack).toContain('MockException: test message with a variable argument');
    }

    try {
      echo.throw({
        name: 'MockException',
        level: 'Mock',
        message: 'test',
        htmlMessage: '<div>#test#</div>',
        toString: function() {
          return this.name
        }
      }, 'a variable argument');
    } catch (e) {
      expect(e.toString()).toBe('MockException');
    }

    try {
      echo.throw({})
    } catch (e) {
      expect(e.html).toBeUndefined();
    }
  });

  test('Invalid item requested', () => {
    let spy = [];
    let conf = { i18n: 'en', logger: mockLogger(spy) };
    const echo =
      EchoHandler(
        { 'test': 'Test Message returned with: {0}, {1} and {2}' },
        conf);
    expect(echo.raw('fakeMessage')).toBe('Could not find message: fakeMessage');
  });

  test ('custom exception thrown (deprecated)', () => {
    const spy = [];
    const conf = {
      i18n: 'en',
      ExceptionClass: function (message, arr) {
        arr.push(message);
      },
      exceptionOptions: spy
    };
    const echoObject = { 'test': 'test message' };
    const echo = EchoHandler({echoObject, conf});


    try {
      echo.throw('test');
    } catch (e) {
      expect(spy[0]).toBe('test message');
    }
  });
});
