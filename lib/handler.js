const { join } = require('path');
const fs = require('fs');
const { parse: urlParse } = require('url');

module.exports = function createHandler({
  cwd,
  name,
  endpoint,
  indexPath,
}) {
  const cache = {};

  return ({ url }, callback) => {
    let {
      host,
      pathname,
    } = urlParse(url);

    pathname = pathname || '';

    if (host !== endpoint) {
      callback({ error: `Unrecognized ${name}:// endpoint: '${host}'` });

      return;
    }

    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const filepath = join(cwd, ...pathSegments);

    // Basic request caching
    if (!cache[url]) {
      try {
        fs.accessSync(filepath);

        if (fs.statSync(filepath).isFile()) {
          cache[url] = filepath;
        }
      } catch (err) {
        //
      }
    }

    // redirect unmet requests to indexPath
    callback({ path: cache[url] || indexPath });
  };
};
