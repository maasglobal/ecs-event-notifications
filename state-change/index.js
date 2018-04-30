'use strict';

const AWS = require('aws-sdk');
const sns = new AWS.SNS({ region: 'eu-west-1' });

module.exports.handler = async (event) => {
  const hasErrors =
    event.detail.containers
      .filter(container => container.exitCode > 0).length > 0;

  if (process.env.MODE === 'all'
    || hasErrors && process.env.MODE === 'errors'
    || !hasErrors && process.env.MODE === 'success') {
      return sns.publish({
        TopicArn: process.env.TOPIC_ARN,
        Message: JSON.stringify(event, null, 2),
      }).promise();
  }

  return Promise.resolve();
};
