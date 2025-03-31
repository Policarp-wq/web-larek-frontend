import { ProductItem } from "../../types";

export class BasketItem{
    index: number = 0; //why index while we have id for each product
    product: ProductItem;
    constructor(product: ProductItem, index: number){
        this.product = product;
        this.index = index;
    }
}