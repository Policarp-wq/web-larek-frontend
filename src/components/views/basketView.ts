import { BasketInfo } from "../../types";
import { bem, cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Basket, BasketItem, IBasket } from "../models/basket";
import { BasketItemView } from "./basketItemView";
import { IView } from "./iview";
import { IViewFactory, ViewFactory } from "./viewFactory";

export class BasketViewFactory extends ViewFactory<BasketView>{
    private _basketItemViewFactory: IViewFactory<BasketItemView>;
    constructor(broker : IEvents, template: HTMLTemplateElement, basketItemViewFactory: IViewFactory<BasketItemView>){
        super(broker, template);
        this._basketItemViewFactory = basketItemViewFactory;
    }
    getView(basket: Basket): BasketView {
        const view = new BasketView(this._basketItemViewFactory);
        const presenter = cloneTemplate<HTMLDivElement>(this._template);
        view.orderBtn = presenter.querySelector(bem("basket", "button").class);
        view.orderBtn.addEventListener('click', () =>{
            if(basket.getProdcutsCnt() == 0){
                console.log("basket is empty");
                return;
            }
                
            const basketInfo: BasketInfo = {
                total: basket.getTotal(),
                items: basket.getProducts().map(pr => pr.id)
            }
            this._broker.emit(BasketView.BasketOrderEvent, basketInfo);
        })
        view.itemsList = presenter.querySelector(bem("basket", "list").class);
        view.totalSpan = presenter.querySelector(bem("basket", "price").class);
        view.holder = presenter;

        this._broker.on(Basket.BasketTotalUpdated, (data) => {
            const total = (data as {total : number}).total;
            view.setTotal(total);
        });

        this._broker.on(BasketItemView.BasketItemRemoveRequestEvent, (basketItem) =>{
            basket.removeItemByIndex((basketItem as BasketItem).index);
        })
        this._broker.on(Basket.BasketChangedEvent, (bask: Basket) => view.fillBasket(bask));
        view.setTotal(basket.getTotal());
        view.fillBasket(basket);
        return view;
    }
}

export class BasketView implements IView{
    holder: HTMLDivElement;
    orderBtn: HTMLButtonElement;
    totalSpan: HTMLSpanElement;
    itemsList: HTMLUListElement;
    private _basketItemViewFactory: IViewFactory<BasketItemView>;
    public static BasketOrderEvent: string = "basket:order"

    constructor(basketItemViewFactory: IViewFactory<BasketItemView>){
        this._basketItemViewFactory = basketItemViewFactory;
    }

    private getBasketItemView(basketItem: BasketItem) : BasketItemView{
        return this._basketItemViewFactory.getView(basketItem);
    }

    fillBasket(basket: IBasket){
        this.itemsList.innerHTML = "";
        basket.getBasketItems().forEach(basketItem => {
            this.itemsList.appendChild(this.getBasketItemView(basketItem).getRendered());
        });
    }

    setTotal(total: number){
        this.totalSpan.textContent = total.toString();
    }
    
    getRendered(): HTMLElement {
        return this.holder;
    }
}