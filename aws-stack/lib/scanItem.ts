import { DynamoDBClient, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});

const inputParams :ScanCommandInput = {
    TableName: "items"
}

const command : ScanCommand = new ScanCommand(inputParams);

export const handler =async () => {
    // DynamoDBテーブルの名前は環境変数から取得する
    return await ddbClient.send(command);
}