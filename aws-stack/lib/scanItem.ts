import { DynamoDBClient, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});

const inputParams :ScanCommandInput = {
    TableName: "items"
}

const command : ScanCommand = new ScanCommand(inputParams);

export const handler = async () => {
    // DynamoDBテーブルの名前は環境変数から取得する
    await ddbClient.send(command);
    // const response = {
    //     "statusCode": 200,
    //     "headers": {
    //         "Content-Type": "application/json"
    //     },
    //     "isBase64Encoded": false,
    //     "multiValueHeaders": {
    //         "X-Custom-Header": ["My value", "My other value"],
    //     },
    //     "body": "{\n  \"TotalCodeSize\": 104330022,\n  \"FunctionCount\": 26\n}"
    // }
    return response
}