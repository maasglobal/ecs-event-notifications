# ECS State Change Notifications

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![Build Status](https://travis-ci.org/maasglobal/ecs-event-notifications.svg?branch=master)](https://travis-ci.org/maasglobal/ecs-event-notifications)

This service is an example implementation how to use AWS CloudWatch events to monitor ECS container states. AWS CloudWatch event triggers a Lambda function that published a message to an SNS topic, which can be subscribed to send, e.g. message to an email address, SMS message, or notification to Slack channel.

## Installation

This service uses [Serverless Framework](https://github.com/serverless/serverless/) to deploy components to AWS.

To install service use `sls install -u https://github.com/maasglobal/ecs-event-notifications -n my-ecs-events`, where `my-ecs-events` is the name of the service you prefer to use.

After installation, change directory to `my-ecs-events` and install dependencies with `npm install`.

## Deployment

When you are ready, you can deploy the service with `sls deploy`.

## Subscribe to SNS topic

By default, this service will not create a subscription to SNS topic, but you can add the subscription, by using CloudFormation, AWS CLI or web console.

To use CloudFormation to subscribe notifications to your email, add following snippet to resources block of the serverless.yml.

```yaml
ECSStateChangeSubscription:
  Type: AWS::SNS::Subscription
  Properties:
    Endpoint: my.email@example.com
    Protocol: email
    TopicArn:
      Ref: ECSStateChangeTopic
```

After deployment, you should have subscription confirmation email titled "AWS Notification - Subscription Confirmation" in your inbox, then follow the instructions on email.

## AWS CloudWatch Event Rules

More info about how to configure the CloudWatch event trigger for ECS [Serverless Docs](https://serverless.com/framework/docs/providers/aws/events/cloudwatch-event/) and [AWS docs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_cwe_events.html)
