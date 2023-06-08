import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const ddbClient = new DynamoDBClient({});

const inputParams :PutItemCommandInput = {
    TableName: "items",
    Item : {
        "ISBN" : {S: "これじゃい！"}
    }
}

const command : PutItemCommand = new PutItemCommand(inputParams);

export const handler = async (event:APIGatewayProxyEvent) => {
    // DynamoDBテーブルの名前は環境変数から取得する
    const params = event.queryStringParameters;
    console.log(params)

    await ddbClient.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify(params)
    };
}



// export const handler = async () :Promise<APIGatewayProxyResult> => {
//     // DynamoDBテーブルの名前は環境変数から取得する
//     const scanData = await ddbClient.send(command);
//     return {
//         statusCode: 200,
//         headers:{
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(scanData.Items)
//     }
