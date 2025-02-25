import { bem, cloneTemplate, getPricePresent } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Basket, BasketItem } from "../models/basket";
import { IView } from "./iview";

export class BasketItemView implements IView{
    private _presenter:  HTMLDivElement;
    private _item: BasketItem;
    private _broker: IEvents;
    public static BasketItemRemoveRequestEvent = "basket_item:remove_requested";
    constructor(broker: IEvents, item: BasketItem, template: HTMLTemplateElement){
        this._item = item;
        this._broker = broker;
        this._presenter = this.createPresenter(template);
    }
    private createPresenter(template: HTMLTemplateElement) : HTMLDivElement{
        const presenter = cloneTemplate<HTMLDivElement>(template);
        presenter.querySelector(bem("basket", "item-index").class)
            .textContent = (this._item.index + 1).toString();
        presenter.querySelector(bem("card", "title").class)
            .textContent = this._item.product.title;

        presenter.querySelector(bem("card", "price").class)
            .textContent = getPricePresent(this._item.product.price);
        (presenter.querySelector(bem("basket", "item-delete").class) as HTMLButtonElement)
            .addEventListener('click', (evt) =>{
                this._broker.emit(BasketItemView.BasketItemRemoveRequestEvent, this._item);
            });
        
        return presenter;
    }
    getRendered(): HTMLElement {
        return this._presenter;
    }
}