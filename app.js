let echoHandlerFactory = require('./index').configure();
let echo = echoHandlerFactory.init('handlerMessages', 'as');
echo.log('test', 'yo');
