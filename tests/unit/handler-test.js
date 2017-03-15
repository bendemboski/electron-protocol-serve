const { assert } = require('chai');
const sinon = require('sinon');
const Promise = require('bluebird');
const fs = require('fs');
const { join, resolve } = require('path');
const subject = require('../../lib/handler');

describe('handler', () => {
  let sandbox;
  let mockFiles;
  let mockDirs;

  before(() => {
    sandbox = sinon.sandbox.create();
    // Stub accessSync to act like only files in mockFiles exist
    sandbox.stub(fs, 'accessSync', path => {
      if (mockFiles.indexOf(path) === -1 && mockDirs.indexOf(path) === -1) {
        throw new Error('Doesn\'t exist');
      }
    });
    sandbox.stub(fs, 'statSync', path => ({
      isFile() {
        return mockFiles.indexOf(path) !== -1;
      },
    }));
  });

  after(() => {
    sandbox.restore();
  });

  beforeEach(() => {
    mockFiles = [];
    mockDirs = [];
  });

  // Create a handler with the specified options
  function createHandler(options) {
    return subject(Object.assign({
      cwd: '.',
      name: 'serve',
      endpoint: 'dist',
      indexPath: join('.', 'index.html'),
    }, options));
  }

  // Call the handler with the given URL
  function callHandler(handler, url) {
    return new Promise((resolve, reject) => {
      handler({ url }, ({ path, error }) => {
        if (path !== undefined) {
          resolve(path);
        } else {
          reject(error);
        }
      });
    });
  }

  // Create a handler with the specified options and call it with the given URL
  function handlerExec(url, options = {}) {
    return callHandler(createHandler(options), url);
  }

  it('works', () => {
    mockDirs.push('.');
    mockFiles.push('script.js');
    return handlerExec('serve://dist/script.js').then(path => {
      assert.equal(path, 'script.js');
    });
  });

  it('works with multiple requests', () => {
    mockDirs.push('.');
    mockFiles.push('script1.js');
    mockFiles.push('script2.js');

    let handler = createHandler();
    return callHandler(handler, 'serve://dist/script1.js').then(path => {
      assert.equal(path, 'script1.js');

      return callHandler(handler, 'serve://dist/script2.js');
    }).then(path => {
      assert.equal(path, 'script2.js');
    });
  });

  it('serves indexPath from the root', () => {
    mockDirs.push('.');
    mockFiles.push('foo.html');
    return handlerExec('serve://dist', {
      cwd: '.',
      indexPath: join('.', 'foo.html'),
    }).then(path => {
      assert.equal(path, join('.', 'foo.html'));
    });
  });

  it('respects relative cwd', () => {
    mockDirs.push(join('foo', 'bar'));
    mockFiles.push(join('foo', 'bar', 'script.js'));
    return handlerExec('serve://dist/script.js', {
      cwd: join('foo', 'bar'),
    }).then(path => {
      assert.equal(path, join('foo', 'bar', 'script.js'));
    });
  });

  it('respects absolute cwd', () => {
    mockDirs.push(resolve('foo', 'bar'));
    mockFiles.push(resolve('foo', 'bar', 'script.js'));
    return handlerExec('serve://dist/script.js', {
      cwd: resolve('foo', 'bar'),
    }).then(path => {
      assert.equal(path, resolve('foo', 'bar', 'script.js'));
    });
  });

  it('respects endpoint', () => {
    mockDirs.push('.');
    mockFiles.push('script.js');
    return handlerExec('serve://custom/script.js', {
      endpoint: 'custom',
    }).then(path => {
      assert.equal(path, 'script.js');
    });
  });

  it('respects indexPath for missing files', () => {
    mockDirs.push('bar');
    mockFiles.push(join('foo', 'bar.html'));
    return handlerExec('serve://dist/missing.js', {
      cwd: 'bar',
      indexPath: join('foo', 'bar.html'),
    }).then(path => {
      assert.equal(path, join('foo', 'bar.html'));
    });
  });

  it('ignores hashes', () => {
    mockDirs.push('.');
    mockFiles.push('script.js');
    return handlerExec('serve://dist/script.js#hash').then(path => {
      assert.equal(path, 'script.js');
    });
  });

  it('ignores query params', () => {
    mockDirs.push('.');
    mockFiles.push('script.js');
    return handlerExec('serve://dist/script.js?query=param').then(path => {
      assert.equal(path, 'script.js');
    });
  });

  it('errors on an unrecognized endpoint', () =>
    handlerExec('service://notdist/script.js').then(() => {
      assert.ok(false);
    }).catch(() => {
      assert.ok(true);
    })
  );
});
