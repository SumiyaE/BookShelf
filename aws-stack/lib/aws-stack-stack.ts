import { aws_apigateway, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

export class AwsStackStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const table = new Table(this, "books", {
            partitionKey: {
                name: "ISBN",
                type: AttributeType.STRING
            },
            tableName: "books",
            removalPolicy: RemovalPolicy.DESTROY
        })

        const putItemFunction = new NodejsFunction(this, 'putItemFunction', {
            entry: "lib/putItem.ts",
            runtime: Runtime.NODEJS_18_X,
        })

        const scanItemFunction = new NodejsFunction(this, 'scanItemFunction', {
            entry: "lib/scanItem.ts",
            runtime: Runtime.NODEJS_18_X,
        })

        const ItemRestAPI = new aws_apigateway.RestApi(this, 'ItemRestAPI', {})
        ItemRestAPI.root.addMethod('GET', new aws_apigateway.LambdaIntegration(scanItemFunction));
        ItemRestAPI.root.addMethod('PUT', new aws_apigateway.LambdaIntegration(putItemFunction));

        table.grantWriteData(putItemFunction)
        table.grantReadData(scanItemFunction)
    }
}
