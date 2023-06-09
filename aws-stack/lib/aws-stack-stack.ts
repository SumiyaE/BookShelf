import { aws_apigateway, aws_ec2, aws_rds, aws_secretsmanager, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Port, SubnetType } from "aws-cdk-lib/aws-ec2";

export class AwsStackStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = new aws_ec2.Vpc(this,'bookShelfVPC',{
            ipAddresses:aws_ec2.IpAddresses.cidr("1.0.0.0/16"),
            vpcName: 'cdk-sample-vpc',
            subnetConfiguration: [
                {
                    subnetType:SubnetType.PRIVATE_ISOLATED,
                    name:"PrivateSubnet"
                }
            ]
        })

        // secretManager
        const secret = new aws_secretsmanager.Secret(this,'dbSecret', {
            secretName: 'secret-test',
            generateSecretString: {
                excludePunctuation: true,
                includeSpace: false,
                generateStringKey: 'password',
                secretStringTemplate: JSON.stringify({
                    user: 'mysql',
                })
            }
        })

        // auroraServerless
        const auroraServerless = new aws_rds.DatabaseCluster(this, 'Database', {
            engine: aws_rds.DatabaseClusterEngine.auroraMysql({ version: aws_rds.AuroraMysqlEngineVersion.VER_3_02_2 }),// AuroraServerlessはVER_3_02以降でないと対応していないので注意
            writer: aws_rds.ClusterInstance.serverlessV2('writer'),
            serverlessV2MinCapacity: 0.5,
            serverlessV2MaxCapacity: 2,
            vpc, // vpcにPRIVATE_ISOLATEDを指定している場合、以下のようにsubnetTypeを明示的にPRIVATE_ISOLATEDに指定しないとエラーになる。
            vpcSubnets:{
                subnetType:aws_ec2.SubnetType.PRIVATE_ISOLATED
            },
            // credentials:aws_rds.Credentials.fromSecret(secret),
        });

        // dynamoDB
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
            vpc:vpc
        })

        const scanItemFunction = new NodejsFunction(this, 'scanItemFunction', {
            entry: "lib/scanItem.ts",
            runtime: Runtime.NODEJS_18_X,
            vpc:vpc
        })

        //
        const ItemRestAPI = new aws_apigateway.RestApi(this, 'ItemRestAPI', {})
        ItemRestAPI.root.addMethod('GET', new aws_apigateway.LambdaIntegration(scanItemFunction));
        ItemRestAPI.root.addMethod('PUT', new aws_apigateway.LambdaIntegration(putItemFunction));

        table.grantWriteData(putItemFunction)
        table.grantReadData(scanItemFunction)

        // サービス間のsecurityGroupの作成
        auroraServerless.connections.allowFrom(putItemFunction,Port.tcp(3306))
        // auroraServerless.connections.allowFrom(scanItemFunction,Port.tcp(3306))
    }
}
