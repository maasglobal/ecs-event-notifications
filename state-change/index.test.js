'use strict';

const sandbox = require('sinon').createSandbox();

const AWS = require('aws-sdk');
const { handler } = require('./index');

describe('State change', () => {
  beforeAll(() => sandbox.stub(AWS.SNS.prototype, 'makeRequest')
  .withArgs('publish')
  .returns({
    promise: () => 'sns',
  }))

  afterEach(() => delete process.env.MODE);

  afterAll(() => sandbox.restore());

  it('sends notification when mode is "all" and exit codes are 0', async () => {
    process.env.MODE = 'all';
    return handler({
      detail: {
        containers: [{ exitCode: 0 }, { exitCode: 0 }, { exitCode: 0 }]
      }
    }).then(response =>
      expect(response).toBe('sns'));
  });

  it('sends notification when mode is "all" and exit codes contains error codes', async () => {
    process.env.MODE = 'all';
    return handler({
      detail: {
        containers: [{ exitCode: 1 }, { exitCode: 4 }, { exitCode: 0 }]
      }
    }).then(response =>
      expect(response).toBe('sns'));
  });

  it('doesn\'t send notification when mode is "errors" and exit codes are 0', async () => {
    process.env.MODE = 'errors';
    return handler({
      detail: {
        containers: [{ exitCode: 0 }, { exitCode: 0 }, { exitCode: 0 }]
      }
    }).then(response =>
      expect(response).toBe('ignoring'));
  });

  it('sends notification when mode is "errors" and contains error codes', async () => {
    process.env.MODE = 'errors';
    return handler({
      detail: {
        containers: [{ exitCode: 1 }, { exitCode: 0 }, { exitCode: 4 }]
      }
    }).then(response =>
      expect(response).toBe('sns'));
  });

  it('doesn\'t send notification when mode is "success" and contains error codes', async () => {
    process.env.MODE = 'success';
    return handler({
      detail: {
        containers: [{ exitCode: 1 }, { exitCode: 0 }, { exitCode: 1 }]
      }
    }).then(response =>
      expect(response).toBe('ignoring'));
  });

  it('sends notification when mode is "success" and all exit codes are 0', async () => {
    process.env.MODE = 'success';
    return handler({
      detail: {
        containers: [{ exitCode: 0 }, { exitCode: 0 }, { exitCode: 0 }]
      }
    }).then(response =>
      expect(response).toBe('sns'));
  });
});
