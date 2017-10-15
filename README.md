# echo-handler
A NodeJS i18n-friendly way of managing messages stored in simple JSON files.  Allows you to store i18n message files (delineated by international language code) in one discrete location and access them by language based on preferences at either compiletime or runtime.  For example, say your web app has detected that a user's IP is in Spain, perhaps you want to serve them corresponding 'es' (language code for 'Español') messages rather than the standard 'en' ('English').  Setting things up is a piece of cake!

## Installation
You can install echo-handler via npm. 
Add echo-handler to the package.json of your app or install it via the command-line: `npm i --save echo-handler`

## Synopsis
Given 2 files at: `<YourProjectRoot>/messages/`:

- `en.exampleMessages.json` (English file) 
- `es.exampleMessages.json` (Spanish file)

`en.exampleMessages.json` file contains:
```javascript
{
  "test": "I am a test message"
}
```
and `es.exampleMessages.json` file contains:
```javascript
{
  "test": "soy un mensaje de prueba"
}
```
to call them from your project's root directory you could do as follows:
```javascript
// SETUP
let echoHandler = require('echo-handler').configure({ messageFolder: `${__dirname}/messages` });
let echo = echoHandler.load('exampleMessages', 'en'); // load the English message set

// IMPLEMENTATION
echo.log('test'); // console log
let test = echo.raw('test'); // assign 'I am a test message' string to the `test` variable
if (test !== 'I am a test message') {
  echo.throw('test'); // throw test as an Error, setting error instance's .message equal to 'I am a test message'
}

echo = echoHandler.load('exampleMessages', 'es'); // load the spanish message set
echo.log('test'); // console will log: 'soy un mensaje de prueba'
```
## Configuration Options
- As a minimum, the `.configure()` method demoed above must be supplied with an object containing a `messageFolder` property.  The messageFolder must be an absolute address.

- before echo can be called it must be initialised by calling `.load()`.  load takes 2 arguments: the name of the message file *with neither i18n code nor extension*; and optionally, the language code of the message file you'd like to return (will default to .i18n from initial configuration or 'en' if all else fails).

##### Example
given a file called `fr.someMessages.json`, echo should be defined as follows:
```javascript
let echo = echoHandler.load('someMessages', 'fr'); 
```

#### Custom Filename regionalization
By default, messages saved on disk must be preceded with their language code; e.g. '**en**.someMessages.json'.  This can be altered however by supplying an alternative regionalizer method in your `.configure({ ... })` call's configuration object. 

Let's suppose you wanted to delineate your language types by i18n coded folders rather than prefixes:
```
./messages/en/someMessage.json
          /es/someMessage.json
          /de/someMessage.json
```
you could do so as follows:
```javascript
let echoHandler = 
  require('echo-handler')
    .configure({ 
      messageFolder:`${__dirname}/messages`,
      regionalizer: (item, language) => { 
        return item.replace(
          /([a-z\d._-]+$)/gi, // generally, this regex pattern is safe enough for most use-cases.
          (match, fileName) => { return `${language}/${fileName}`; 
      });
    });
```

Likewise, suppose you wanted the following setup:
```
./messages/someMessage.en.json
          /someMessage.fr.json
          /someMessage.de.json
```
you could do so as follows:
```javascript
let echoHandler = 
  require('echo-handler')
    .configure({ 
      messageFolder:`${__dirname}/messages`,
      regionalizer: (item, language) => { 
        return item.replace(
          /([a-z\d._-]+$)/gi,
          (match, fileName) => { return `${fileName}.${language}`; 
      });
    });
```

#### Default Configuration
these are the default configuration options for this application
```javascript
{
  i18n: 'en', // Default language used for internal error messages. Currently only supports 'en' foreign error message contributions welcome, PLEASE FORK!    
  logger: console, // supply an object that has a .log(string) method and echo.log() will use that instead.
  messageFolder: undefined, // MANDATORY: the absolute location of your message files 
  regionalizer: (item, language) => { // this is the default regionalizer
    return item.replace(
      /([a-z\d._-]+$)/gi,
      (match, fileName) => { return `${language}.${fileName}`; });
  }; 
};
```

