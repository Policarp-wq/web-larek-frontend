import { bem, cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";

export class ProductCardView implements IView {
    private _product: ProductItem;
    Card: HTMLDivElement;
    public static BasketAddedEvent : string = "product:added";
    constructor(broker: IEvents, product: ProductItem, template: HTMLTemplateElement){
        this._product = product;
        this.Card = ProductCardView.getProductCard(this._product, template, broker);
    }

    private static getProductCard(product : ProductItem, template: HTMLTemplateElement, broker: IEvents) : HTMLDivElement{
        const card = cloneTemplate<HTMLDivElement>(template);

        (card.querySelector(".card__image") as HTMLImageElement).src = "/Asterisk 2.svg";
        const category : HTMLSpanElement = card.querySelector(".card__category");

        category.textContent = product.category;
        category.classList.add(bem("card", "category", product.category).name);

        (card.querySelector(".card__title") as HTMLHeadingElement).textContent = product.title;
        (card.querySelector(".card__text") as HTMLParagraphElement).textContent = product.description;
        (card.querySelector(".card__price") as HTMLSpanElement)
            .textContent = (product.price == null ? "Нет цены" : product.price.toString());
        const button : HTMLButtonElement = card.querySelector(".card__button");
        if(product.price){
            // ADD EVENT LISTENER!!!
            button.addEventListener("click", (evt) => {
                broker.emit(this.BasketAddedEvent, product);
            })
        }
        else {
            button.disabled = true;
        }
        return card;
    }

    getRendered(): HTMLElement {
        return this.Card;
    }
}