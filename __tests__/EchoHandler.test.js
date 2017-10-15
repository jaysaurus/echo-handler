const EchoHandler = require('../lib/EchoHandler');
describe('EchoHandler integration tests', () => {
  const mockLogger = spy => {
    return {
      log: message => { spy.push(message) }
    };
  }

  test ('valid item returns respective raw string, log output and exception object', () => {
    let spy = [];
    let conf = { i18n: 'en', logger: mockLogger(spy) };
    const echoObject = { 'test': 'Test Message returned with: {0}, {1} and {2}' };
    const echo = new EchoHandler(echoObject, conf);
    const message = 'Test Message returned with: a, b and c';

    expect(echo.raw('test', 'a', 'b', 'c')).toBe(message);

    echo.log('test', 'a', 'b', 'c');
    expect(spy[0]).toBe(message);

    let thrown = '';
    try { echo.throw('test', 'a', 'b', 'c'); }
    catch (e) { thrown = e.message; }
    expect(thrown).toBe(message);

    // edge case for where arguments are expected but undefined
    expect(echo.raw('test')).toBe(echoObject.test);
  });

  test('Invalid item requested', () => {
    let spy = [];
    let conf = { i18n: 'en', logger: mockLogger(spy) };
    const echo =
      new EchoHandler(
        { 'test': 'Test Message returned with: {0}, {1} and {2}' },
        conf);
    expect(echo.raw('fakeMessage')).toBe('Could not find message: fakeMessage');
  });
});
