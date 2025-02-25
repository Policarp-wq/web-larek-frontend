import { ProductItem, сategoryType } from "../../types";
import { bem, cloneTemplate, getPricePresent } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";
import { ViewFactory } from "./viewFactory";

export class CatalogProductViewFactory extends ViewFactory<CatalogProductView>{
    
    constructor(broker : IEvents, template: HTMLTemplateElement){
        super(broker, template);
    }
    getView(product: ProductItem): CatalogProductView {
        const view = new CatalogProductView();
        view.holder = cloneTemplate<HTMLButtonElement>(this._template);
        view.category = view.holder.querySelector(".card__category");
        view.image = view.holder.querySelector(".card__image");
        view.title = view.holder.querySelector(".card__title");
        view.price = view.holder.querySelector(".card__price");

        view.holder.addEventListener('click', () =>{
            this._broker.emit(CatalogProductView.CatalogProductClickedEvent, product); // map catalog - preview
        });

        view.category.textContent = product.category;
        const categoryKey = product.category as keyof typeof сategoryType;
        view.category.classList.add(bem("card", "category", сategoryType[categoryKey]).name);

        view.title.textContent = product.title;
        view.price.textContent = getPricePresent(product.price);
        view.image.src = product.image;

        return view;
    }
}

export class CatalogProductView implements IView{
    category: HTMLSpanElement;
    holder: HTMLButtonElement;
    image: HTMLImageElement;
    title: HTMLHeadingElement;
    price: HTMLSpanElement;
    public static CatalogProductClickedEvent : string = "catalog_item:clicked";

    getRendered(): HTMLElement {
        return this.holder;
    }
}