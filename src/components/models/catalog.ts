export class Catalog{
    private _products: ProductItem[]
    constructor(products: ProductItem[]){
        this._products = products;
    }

    getProducts() : ProductItem[]{
        return this._products;
    }
}