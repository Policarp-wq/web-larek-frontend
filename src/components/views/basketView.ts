import { bem, cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Basket, BasketItem, IBasket } from "../models/basket";
import { BasketItemView } from "./basketItemView";
import { IView } from "./iview";

export class BasketView implements IView{
    private _basket: IBasket;
    private _presenter: HTMLDivElement;
    private readonly _broker : IEvents;
    private _totalSpan: HTMLSpanElement;
    private _itemsList: HTMLUListElement;
    private readonly _basketItemTemplate: HTMLTemplateElement;
    public static BasketOrderEvent: string = "basket:order"

    constructor(broker : IEvents, basket: IBasket, template: HTMLTemplateElement, basketItemTemplate: HTMLTemplateElement){
        this._basket = basket;
        this._broker = broker;
        this._basketItemTemplate = basketItemTemplate;

        this._presenter = this.createPresenter(template);
    }
    private createPresenter(template: HTMLTemplateElement) : HTMLDivElement{
        const presenter = cloneTemplate<HTMLDivElement>(template);
        const orderBtn: HTMLButtonElement = presenter.querySelector(bem("basket", "button").class);
        orderBtn.addEventListener('click', (evt) =>{
            this._broker.emit(BasketView.BasketOrderEvent, this._basket.getProducts());
        })
        this._itemsList = presenter.querySelector(bem("basket", "list").class);

        this._totalSpan = presenter.querySelector(bem("basket", "price").class)
        

        this._broker.on(Basket.BasketTotalUpdated, (data) => {
            const total = (data as {total : number}).total;
            this.setTotal(total);
        });

        this._broker.on(BasketItemView.BasketItemRemoveRequestEvent, (basketItem) =>{
            this._basket.removeItemByIndex((basketItem as BasketItem).index);
        })
        this._broker.on(Basket.BasketChangedEvent, () => this.fillBasket());
        this.setTotal(this._basket.getTotal());
        this.fillBasket();
        return presenter;
    }

    private getBasketItemView(basketItem: BasketItem) : BasketItemView{
        return new BasketItemView(this._broker, basketItem, this._basketItemTemplate);
    }

    private fillBasket(){
        this._itemsList.innerHTML = "";
        this._basket.getProducts().forEach(basketItem => {
            this._itemsList.appendChild(this.getBasketItemView(basketItem).getRendered());
        });
    }


    private setTotal(total: number){
        this._totalSpan.textContent = total.toString();
    }
    
    getRendered(): HTMLElement {
        return this._presenter;
    }
}