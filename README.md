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

### protocolServe(cwd, options)

```js
/**
 * @param  {String} cwd                        the path to the dist folder of your Ember app
 * @param  {Object} options.app                electron.app
 * @param  {Object} options.protocol           electron.protocol
 * @param  {String} options.name               name of your protocol, defaults to `serve`
 * @param  {String} options.endpoint           endpoint of your protocol, defaults to `dist`
 * @param  {String} options.directoryIndexFile directory index. usally the default, `index.html`
 * @return {String}                            name of your protocol
 */
```



## Credits

- [@pichfl](https://github.com/pichfl) Initial protocol
- [@bendemboski](https://github.com/bendemboski) Testing, idea for extraction
