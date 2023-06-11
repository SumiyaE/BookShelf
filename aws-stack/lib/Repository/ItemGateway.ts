import { PutItemCommandOutput, ScanCommandOutput } from "@aws-sdk/client-dynamodb";

export interface ItemGateway {
    TABLE_NAME: string

    putItem(isbn: string): Promise<PutItemCommandOutput>

    scanItem(): Promise<ScanCommandOutput>
}