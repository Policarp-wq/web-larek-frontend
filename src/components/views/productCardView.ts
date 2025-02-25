import { ProductItem, сategoryType } from "../../types";
import { bem, cloneTemplate, getPricePresent } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";

export class ProductCardView implements IView {
    private _product: ProductItem;
    private _presenter: HTMLDivElement;
    public static BasketAddedEvent : string = "product:added";
    constructor(broker: IEvents, product: ProductItem, template: HTMLTemplateElement){
        this._product = product;
        this._presenter = this.createPresenter(this._product, template, broker);
    }

    private createPresenter(product : ProductItem, template: HTMLTemplateElement, broker: IEvents) : HTMLDivElement{
        const card = cloneTemplate<HTMLDivElement>(template);

        (card.querySelector(".card__image") as HTMLImageElement).src = product.image;
        const category : HTMLSpanElement = card.querySelector(".card__category");

        category.textContent = product.category;
        const categoryKey = product.category as keyof typeof сategoryType;
                category.classList.add(bem("card", "category", сategoryType[categoryKey]).name);
                
        (card.querySelector(".card__title") as HTMLHeadingElement).textContent = product.title;
        (card.querySelector(".card__text") as HTMLParagraphElement).textContent = product.description;
        (card.querySelector(".card__price") as HTMLSpanElement)
            .textContent = getPricePresent(product.price);

        const button : HTMLButtonElement = card.querySelector(".card__button");
        if(product.price){
            button.addEventListener("click", (evt) => {
                broker.emit(ProductCardView.BasketAddedEvent, product);
            })
        }
        else {
            button.disabled = true;
        }
        return card;
    }

    getRendered(): HTMLElement {
        return this._presenter;
    }
}