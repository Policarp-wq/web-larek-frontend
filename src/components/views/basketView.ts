import { BasketInfo } from "../../types";
import { bem, cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Basket, BasketItem, IBasket } from "../models/basket";
import { BasketItemView } from "./basketItemView";
import { IDisposable } from "./idisposable";
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

        this._broker.on(Basket.BasketTotalUpdated, (basket: Basket) => {
            view.setTotal(basket.getTotal());
        });

        this._broker.on(BasketItemView.BasketItemRemoveRequestEvent, (basketItem: BasketItem) =>{
            basket.removeItemByIndex(basketItem.index);
        })
        this._broker.on(Basket.BasketChangedEvent, (bask: Basket) =>{
            view.updateView(bask);
        }) ;
        view.updateView(basket);
        return view;
    }
}

export class BasketView implements IView, IDisposable{
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

    updateView(basket: IBasket){
        this.orderBtn.disabled = !basket.canBeOrdered();
        this.fillBasket(basket);
        this.setTotal(basket.getTotal())
    }

    private fillBasket(basket: IBasket){
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
    dispose(): void {
        
    }
}