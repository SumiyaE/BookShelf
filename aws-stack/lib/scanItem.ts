import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyResult } from "aws-lambda";
import { ItemRepository } from "./Repository/ItemRepository";

export const handler = async () :Promise<APIGatewayProxyResult> => {
    // DynamoDBテーブルの名前は環境変数から取得する
    const ddbClient = new DynamoDBClient({});
    const itemRepository = new ItemRepository(ddbClient)
    const scanData = await itemRepository.scanItem();
    return {
        statusCode: 200,
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scanData.Items)
    }
}