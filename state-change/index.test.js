'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const { handler } = require('./index');

const AWS = require('aws-sdk');

let sandbox;

function mockAWSCall(service, method, expectedArgs, response) {
  let stub = {};
  stub[method] = function(args) {
    if (expectedArgs) {
      expect(args).to.deep.equal(expectedArgs);
    }
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
          if (response.startsWith('ERROR:')) {
            return reject(response);
          }
          return resolve(response);
        });
      }
    };
  };
  return sandbox.stub(AWS, service).returns(stub);
}

describe('State change', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    delete process.env.MODE;
    sandbox.restore();
  });

  it('sends notification when mode is "all"', async () => {
    process.env.MODE = 'all';

    mockAWSCall('SNS', 'publish', {
      Message: 'foo',
    }, '');

    return handler({
      detail: {
        containers: [{ exitCode: 0 }]
      }
    });
  });
});
