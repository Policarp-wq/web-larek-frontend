import { bem, cloneTemplate, getPricePresent } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Basket, BasketItem } from "../models/basket";
import { IView } from "./iview";
import { ViewFactory } from "./viewFactory";

export class BasketItemViewFactory extends ViewFactory<BasketItemView>{
    constructor(broker: IEvents, template: HTMLTemplateElement){
        super(broker, template);
    }

    getView(basketItem: BasketItem): BasketItemView {
        const view = new BasketItemView();
        const presenter = cloneTemplate<HTMLDivElement>(this._template);
        view.index = presenter.querySelector(bem("basket", "item-index").class);
        view.price = presenter.querySelector(bem("card", "price").class);
        view.deleteBtn = presenter.querySelector(bem("basket", "item-delete").class)
        view.deleteBtn.addEventListener('click', () =>{
            this._broker.emit(BasketItemView.BasketItemRemoveRequestEvent, basketItem);
        });
        view.title = presenter.querySelector(bem("card", "title").class);
        view.holder = presenter;

        view.index.textContent = (basketItem.index + 1).toString();
        view.title.textContent = basketItem.product.title;
        view.price.textContent = basketItem.product.price.toString();
        
        return view;
    }
}

export class BasketItemView implements IView{
    holder:  HTMLDivElement;
    index: HTMLSpanElement;
    title: HTMLSpanElement;
    price: HTMLSpanElement;
    deleteBtn: HTMLButtonElement;
    public static BasketItemRemoveRequestEvent = "basket_item:remove_requested";

    getRendered(): HTMLElement {
        return this.holder;
    }
}