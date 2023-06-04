import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});

const inputParams :PutItemCommandInput = {
    TableName: "items",
    Item : {
        "ISBN" : {S: "これじゃい！"}
    }
}

const command : PutItemCommand = new PutItemCommand(inputParams);

export const handler =async () => {
    // DynamoDBテーブルの名前は環境変数から取得する
    return await ddbClient.send(command);
}