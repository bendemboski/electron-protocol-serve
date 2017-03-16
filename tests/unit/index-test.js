const { assert } = require('chai');
const mock = require('mock-require');
const sinon = require('sinon');
const { join } = require('path');
const { clone } = require('lodash');

describe('index', () => {
  let env;
  let app;
  let protocol;
  let onAppReady;
  let protocolName;
  let handlerOptions;
  let handlerStub;

  function register(options) {
    require('../..')(Object.assign({
      cwd: '.',
      app,
      protocol,
    }, options));
  }

  //
  // Mock our handler library
  //
  beforeEach(() => {
    handlerStub = sinon.stub();
    handlerStub.callsArgWith(1, { path: '/path/to/index.html' });

    mock('../../lib/handler', options => {
      handlerOptions = options;
      return handlerStub;
    });
  });

  afterEach(() => {
    mock.stop('../../lib/handler');
  });

  //
  // Sandbox any changes to the environment
  //
  beforeEach(() => {
    env = clone(process.env);
  });

  afterEach(() => {
    process.env = env;
  });

  //
  // Set up our stubbed app and protocol
  //
  beforeEach(() => {
    app = {
      on(evt, cb) {
        if (evt === 'ready') {
          onAppReady = cb;
        }
      },
    };

    protocol = {
      registerFileProtocol(name/*, handler, errorHandler*/) {
        protocolName = name;
      },
    };
  });

  it('works', () => {
    register();
    assert.ok(onAppReady);
    onAppReady();

    assert.equal(protocolName, 'serve');
    assert.deepEqual(handlerOptions, {
      cwd: '.',
      name: 'serve',
      endpoint: 'dist',
      indexPath: join('.', 'index.html'),
    });
    assert.ok(handlerStub.calledWith({ url: 'serve://dist' }));
    assert.equal(process.env.ELECTRON_PROTOCOL_SERVE_INDEX, '/path/to/index.html');
  });

  it('works with a custom cwd', () => {
    register({
      cwd: join('foo', 'bar'),
    });
    assert.ok(onAppReady);
    onAppReady();

    assert.equal(protocolName, 'serve');
    assert.deepEqual(handlerOptions, {
      cwd: join('foo', 'bar'),
      name: 'serve',
      endpoint: 'dist',
      indexPath: join('foo', 'bar', 'index.html'),
    });
    assert.ok(handlerStub.calledWith({ url: 'serve://dist' }));
    assert.equal(process.env.ELECTRON_PROTOCOL_SERVE_INDEX, '/path/to/index.html');
  });

  it('works with non-default arguments', () => {
    register({
      cwd: join('my', 'old'),
      name: 'friend',
      endpoint: 'so',
      indexPath: join('we', 'meet', 'again.html'),
    });
    assert.ok(onAppReady);
    onAppReady();

    assert.equal(protocolName, 'friend');
    assert.deepEqual(handlerOptions, {
      cwd: join('my', 'old'),
      name: 'friend',
      endpoint: 'so',
      indexPath: join('we', 'meet', 'again.html'),
    });
    assert.ok(handlerStub.calledWith({ url: 'friend://so' }));
    assert.equal(process.env.ELECTRON_PROTOCOL_SERVE_INDEX, '/path/to/index.html');
  });

  it('required a cwd', () => {
    assert.throws(() => register({ cwd: undefined }));
  });

  it('required an app', () => {
    assert.throws(() => register({ app: undefined }));
  });

  it('required a protocol', () => {
    assert.throws(() => register({ protocol: undefined }));
  });
});
