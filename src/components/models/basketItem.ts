export interface IBasketItem{
    remove() : void;
    getPrice() : number;
    geTitle(): string;
}

export class BasketItem implements IBasketItem{
    private _product: ProductItem;
    constructor(product: ProductItem){
        this._product = product;
    }
    remove(): void {
        
    }

    getPrice(): number {
        return this._product.price;
    }

    geTitle(): string {
        return this._product.title;
    }
}