import { ProductItem } from "../../types";
import { IEvents } from "../base/events";
import { BasketItem } from "./basketItem";



export interface IBasket{
    addItem(item: ProductItem): void;
    removeItem(item: ProductItem) : void;
    removeItemByIndex(index: number) : void;
    getBasketItems(): BasketItem[];
    getProducts(): ProductItem[];
    getTotal(): number;
    getProdcutsCnt(): number;
    clear(): void;
    canBeOrdered() : boolean;
}

export class Basket implements IBasket{
    private _products: BasketItem[];
    private _broker: IEvents;
    public static BasketItemAddedEvent = "basket:added";
    public static BasketItemRemovedEvent = "basket:removed";
    public static BasketTotalUpdated = "basket:total_updated"
    public static BasketClearedEvent = "basket:cleared";
    public static BasketChangedEvent = "basket:changed";
    private _total: number = 0;
    constructor(broker: IEvents){
        this._broker = broker;
        this._products = [];
        this._broker.on(Basket.BasketItemAddedEvent, () => {
            this._broker.emit(Basket.BasketChangedEvent, this);
        });
        this._broker.on(Basket.BasketItemRemovedEvent, () => {
            this._broker.emit(Basket.BasketChangedEvent, this);
        })
        this._broker.on(Basket.BasketClearedEvent, () => {
            this._broker.emit(Basket.BasketChangedEvent, this);
        })
    }
    addItem(item: ProductItem){
        if(!item.price){
            console.error("Adding item without price is prohibited! Product: " + item.id);
            return;
        }
        if(this._products.some(pr => pr.product.id === item.id)){
            console.log(`Item with id: ${item.id} already in basket`);
            return;
        }
        this._products.push(new BasketItem(item, this._products.length));
        this._total += item.price; 
        this._broker.emit(Basket.BasketItemAddedEvent, item);
        this._broker.emit(Basket.BasketTotalUpdated, this);
    }
    removeItemByIndex(itemInd: number){
        if(itemInd < 0 || itemInd >= this._products.length){
            console.error("Attempt to remove index out of array");
            return;
        }
            
        for(let i = itemInd + 1; i < this._products.length; ++i){
            this._products[i].index = i - 1;
        }
        const copy = this._products[itemInd];
        this._products = this._products.slice(0, itemInd)
            .concat(this._products.slice(itemInd + 1));
        this._total -= copy.product.price;
        this._broker.emit(Basket.BasketItemRemovedEvent, copy);
        this._broker.emit(Basket.BasketTotalUpdated, this);
        this._broker.emit(Basket.BasketChangedEvent, this);
    }
    removeItem(item: ProductItem){
        if(!this.contains(item.id))
            return;
        let itemInd = -1;
        for(let i = 0; i < this._products.length; ++i){
            if(this._products[i].product.id === item.id){
                itemInd = i;
                break;
            }
        }
        if(itemInd === -1){
            console.log(`Didn't find basket item with given id: ${item.id}`);
            return;
        }
        this.removeItemByIndex(itemInd);
    }

    contains(id: string): boolean{
        return this._products.some(it => it.product.id === id);
    }

    getProducts(): ProductItem[] {
        return this._products.map(it => it.product);
    }
    
    getBasketItems(): BasketItem[] {
        return this._products;
    }
    getTotal(): number {
        return this._total; 
    }
    getProdcutsCnt(): number {
        return this._products.length;
    }
    canBeOrdered() : boolean{
        return this.getProdcutsCnt() > 0;
    }
    clear(): void {
        this._products = [];
        this._total = 0;
        this._broker.emit(Basket.BasketTotalUpdated, this);
        this._broker.emit(Basket.BasketClearedEvent);
    }
} 

export { BasketItem };
