import { DynamoDBClient, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";

export class ItemRepository {
    private  readonly TABLE_NAME:string = 'Item';
    constructor(private ddbClient :DynamoDBClient) {
    }
    public scanItem () {
        const inputParams : ScanCommandInput = {TableName:this.TABLE_NAME};
        const command :ScanCommand = new ScanCommand(inputParams);
        return this.ddbClient.send(command);
    }
}