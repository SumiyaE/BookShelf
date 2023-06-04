#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsStackStack } from '../lib/aws-stack-stack';

const app = new cdk.App();
new AwsStackStack(app, 'AwsStackStack');
