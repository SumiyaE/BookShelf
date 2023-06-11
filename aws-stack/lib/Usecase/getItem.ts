import { ItemGateway } from "../Repository/ItemGateway";

export class GetItem {
    constructor(private ItemRepository: ItemGateway) {
    }

    public getAllItems() {
        return this.ItemRepository.scanItem()
    }
}