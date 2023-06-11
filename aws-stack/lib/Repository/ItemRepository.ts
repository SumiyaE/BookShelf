import {
    DynamoDBClient,
    PutItemCommand,
    PutItemCommandInput,
    ScanCommand,
    ScanCommandInput
} from "@aws-sdk/client-dynamodb";
import { ItemGateway } from "./ItemGateway";

export class ItemRepository implements ItemGateway {
    readonly TABLE_NAME: string = 'books';

    constructor(private ddbClient: DynamoDBClient) {
    }

    public scanItem() {
        const scanCommand = this.createScanCommand()
        return this.ddbClient.send(scanCommand);
    }

    private createScanCommand() {
        const inputParams: ScanCommandInput = {TableName: this.TABLE_NAME};
        return new ScanCommand(inputParams);
    }

    public putItem(isbn: string) {
        const putItemCommand = this.createPutItemCommand(isbn)
        return this.ddbClient.send(putItemCommand);
    }

    private createPutItemCommand(isbn: string) {
        const inputParams: PutItemCommandInput = {
            TableName: "books",
            Item: {
                ISBN: {S: isbn}
            }
        }
        return new PutItemCommand(inputParams);
    }
}

