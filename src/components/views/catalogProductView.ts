import { ProductItem, сategoryType } from "../../types";
import { bem, cloneTemplate, getPricePresent } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";

export class CatalogProductView implements IView{
    private _product : ProductItem;
    private _presenter: HTMLDivElement;
    public static CatalogProductClickedEvent : string = "catalog_item:clicked";
    constructor(broker : IEvents, product: ProductItem, template: HTMLTemplateElement){
        this._product = product;
        this._presenter = CatalogProductView.createPresenter(broker, product, template);
    }
    static createPresenter(broker: IEvents, product: ProductItem, template: HTMLTemplateElement): HTMLDivElement {
        const btn = cloneTemplate<HTMLDivElement>(template);
        btn.addEventListener('click', (evt) =>{
            broker.emit(this.CatalogProductClickedEvent, product); // map catalog - preview
        });

        const category : HTMLSpanElement = btn.querySelector(".card__category"); 
        category.textContent = product.category;
        
        (btn.querySelector(".card__image") as HTMLImageElement).src = product.image;

        const categoryKey = product.category as keyof typeof сategoryType;
        category.classList.add(bem("card", "category", сategoryType[categoryKey]).name);

        (btn.querySelector(".card__title") as HTMLHeadingElement).textContent = product.title;
        (btn.querySelector(".card__price") as HTMLSpanElement)
            .textContent = getPricePresent(product.price);

        return btn;
    }
    getRendered(): HTMLElement {
        return this._presenter;
    }
}