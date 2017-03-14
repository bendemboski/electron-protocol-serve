const { join } = require('path');
const fs = require('fs');
const url = require('url');

module.exports = function createHandler({
  cwd,
  name,
  endpoint,
  directoryIndexFile,
  indexPath,
}) {
  indexPath = indexPath || join(cwd, directoryIndexFile);
  const cache = {};

  return (request, callback) => {
    let {
      host,
      pathname,
    } = url.parse(request.url);

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
  };
};
