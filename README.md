# electron-protocol-serve

A file protocol that serves any existing file in a directory and redirects everything not found to index.html.

Made for [ember-electron](https://github.com/felixrieseberg/ember-electron).



## Usage

If you want to use it directly, you may do so at your own risk. Remember to register protocols and schemes before
`app.on('ready')`.

In your `electron.js` file:

```js
const { app, protocol } = require('electron');
const protocolServe = require('electron-protocol-serve');

// Create the protocol
const protocolServeName = protocolServe('path/to/your/dist/folder', { app, protocol });

// The protocol we created needs to be registered
protocol.registerStandardSchemes([protocolServeName], { secure: true });

// After registering protocol and schema, you can use it to serve your app to your window
app.on('ready', () => {
  mainWindow = new BrowserWindow();

  mainWindow.loadUrl('serve://dist'); // Will serve index.html from the folder you specified
});
```



## API

See `index.js`.


## Credits

- [@pichfl](https://github.com/pichfl) Initial protocol
- [@bendemboski](https://github.com/bendemboski) Testing, idea for extraction
