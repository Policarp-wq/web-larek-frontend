import { ProductFull, ProductItem, сategoryType } from "../../types";
import { bem, cloneTemplate, getPricePresent } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";
import { ViewFactory } from "./viewFactory";

export class ProductFullViewFactory extends ViewFactory<ProductFullView>{
    constructor(broker: IEvents, template: HTMLTemplateElement){
        super(broker, template);
    }
    getView(productFull: ProductFull): ProductFullView {
        const view = new ProductFullView();
        const card = cloneTemplate<HTMLDivElement>(this._template);
        view.image = card.querySelector(".card__image");
        view.category = card.querySelector(".card__category");
        view.title = card.querySelector(".card__title");
        view.text = card.querySelector(".card__text");
        view.price = card.querySelector(".card__price");
        view.addBasket = card.querySelector(".card__button");
        view.holder = card;

        const product = productFull.product;
        view.image.src = product.image;
        view.title.textContent = product.title
        view.category.textContent = product.category;
        view.text.textContent = product.description;
        view.price.textContent = getPricePresent(product.price);
        const categoryKey = product.category as keyof typeof сategoryType;
                view.category.classList.add(bem("card", "category", сategoryType[categoryKey]).name);
        if(product.price && productFull.available){
            view.addBasket.addEventListener("click", () => {
                this._broker.emit(ProductFullView.BasketAddedEvent, product);
            })
        }
        else {
            view.addBasket.disabled = true;
        }
        return view;
    }
}

export class ProductFullView implements IView {
    category: HTMLSpanElement;
    holder: HTMLDivElement;
    image: HTMLImageElement;
    title: HTMLHeadingElement;
    text: HTMLParagraphElement;
    addBasket: HTMLButtonElement;
    price: HTMLSpanElement;

    public static BasketAddedEvent : string = "product:added";

    getRendered(): HTMLElement {
        return this.holder;
    }
}