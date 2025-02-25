import { ProductItem } from "../../types";

export class BasketItem{
    index: number = 0;
    product: ProductItem;
    constructor(product: ProductItem, index: number){
        this.product = product;
        this.index = index;
    }
}