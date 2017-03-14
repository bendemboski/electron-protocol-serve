const { join } = require('path');
const fs = require('fs');
const { parse: urlParse } = require('url');

module.exports = function createHandler({
  cwd,
  name,
  endpoint,
  directoryIndexFile,
  indexPath,
}) {
  indexPath = indexPath || join(cwd, directoryIndexFile);
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

    if (pathSegments.length === 0) {
      pathSegments.push(directoryIndexFile);
    }

    const filepath = join(cwd, ...pathSegments);

    // Basic request caching
    if (!cache[url]) {
      try {
        fs.accessSync(filepath);

        cache[url] = filepath;
      } catch (err) {
        //
      }
    }

    // redirect unmet requests to directoryIndexFile
    callback({ path: cache[url] || indexPath });
  };
};
