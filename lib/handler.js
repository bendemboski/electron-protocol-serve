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
    cache[url] = cache[url] || resolvePath(filepath, indexPath);
    callback({ path: cache[url] });
  };
};

function resolvePath(filepath, defaultPath) {
  let stat;
  try {
    fs.accessSync(filepath);
    stat = fs.statSync(filepath);
  } catch (e) {
    // file doesn't exist or isn't accessible
    return defaultPath;
  }

  if (stat.isFile()) {
    return filepath;
  } else if (stat.isDirectory()) {
    // It's a directory, so look for an 'index.html' inside it
    return resolvePath(join(filepath, 'index.html'), defaultPath);
  } else {
    // Not a file or directory, so we don't really know how to handle it
    return defaultPath;
  }
}
