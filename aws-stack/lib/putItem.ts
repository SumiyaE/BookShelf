import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ItemRepository } from "./Repository/ItemRepository";

const ddbClient = new DynamoDBClient({});


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // @ts-ignore
    const isbn: string = event.queryStringParameters["isbn"];
    const itemRepository = new ItemRepository(ddbClient)
    const result = await itemRepository.putItem(isbn);
    if (result.$metadata.httpStatusCode != 200) throw new Error('失敗！')

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
}