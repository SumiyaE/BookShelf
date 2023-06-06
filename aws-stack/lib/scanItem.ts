import { DynamoDBClient, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyResult } from "aws-lambda";

const ddbClient = new DynamoDBClient({});

const inputParams :ScanCommandInput = {
    TableName: "items"
}

const command : ScanCommand = new ScanCommand(inputParams);

export const handler = async () :Promise<APIGatewayProxyResult> => {
    // DynamoDBテーブルの名前は環境変数から取得する
    const scanData = await ddbClient.send(command);
    return {
        statusCode: 200,
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scanData.Items)
    }
}