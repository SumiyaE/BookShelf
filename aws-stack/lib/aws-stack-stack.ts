import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

export class AwsStackStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    //
    // const queue = new sqs.Queue(this, 'AwsStackQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
    //
    // const topic = new sns.Topic(this, 'AwsStackTopic');
    //
    // topic.addSubscription(new subs.SqsSubscription(queue));
    const tablle = new Table(this,"item",{
      partitionKey : {
        name : "ISBN",
        type : AttributeType.STRING
      },
      tableName: "items",
      removalPolicy: RemovalPolicy.DESTROY
    })

    const putItemFunction = new NodejsFunction(this, 'putItemFunction', {
      entry : "../lambda/putItem.ts",
      runtime : Runtime.NODEJS_18_X,
      handler : "putItem"
    })
  }
}
