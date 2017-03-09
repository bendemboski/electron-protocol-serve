const { join } = require('path');
const fs = require('fs');

function requiredParam(param, errorMessage) {
  if (!param) {
    throw new Error(`electron-protocol-serve: ${errorMessage}`);
  }
}

/**
 * Registers a file protocol with a single endpoint which handles
 * the proper discovery of local files inside of Electron
 * without modifiying the Ember app.
 *
 * @param  {String} options.cwd                the path to the dist folder of your Ember app
 * @param  {Object} options.app                electron.app
 * @param  {Object} options.protocol           electron.protocol
 * @param  {String} options.name               name of your protocol, defaults to `serve`
 * @param  {String} options.endpoint           endpoint of your protocol, defaults to `dist`
 * @param  {String} options.directoryIndexFile directory index. usally the default, `index.html`
 * @param  {String} options.indexPath          defaults to cwd + directoryIndexFile
 *
 * @return {String}                            name of your protocol
 */
module.exports = function protocolServe({
  cwd = undefined,
  app,
  protocol,
  name = 'serve',
  endpoint = 'dist',
  directoryIndexFile = 'index.html',
  indexPath = undefined,
}) {
  requiredParam(cwd, 'cwd must be specified, should be a valid path');
  requiredParam(protocol, 'protocol must be specified, should be electron.protocol');
  requiredParam(app, 'app must be specified, should be electron.app');

  indexPath = indexPath || join(cwd, directoryIndexFile);

  const cache = {};
  const prefixLength = name.length + 3 + endpoint.length;

  app.on('ready', () => {
    protocol.registerFileProtocol(name, (request, callback) => {
      // the request url should start with ' ${name}://${endpoint}', remove that
      const [url/* , hash */] = request.url.substr(prefixLength).split('#');
      const urlSegments = url.split('/').filter(segment => segment !== '');

      if (urlSegments.length === 0) {
        urlSegments.push(directoryIndexFile);
      }

      const filepath = join(cwd, ...urlSegments);

      // redirect empty requests to index.html
      if (!cache[url]) {
        try {
          fs.accessSync(filepath);

          cache[url] = filepath;
        } catch (err) {
          //
        }
      }

      callback({ path: cache[url] || indexPath });
    }, error => {
      if (error) {
        console.error('Failed to register protocol');
      }
    });
  });

  return name;
};
