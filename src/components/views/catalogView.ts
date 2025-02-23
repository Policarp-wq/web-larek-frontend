import { bem, createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Catalog } from "../models/catalog";
import { IView } from "./iview";
import { ProductCardView } from "./productCardView";

export class CatalogView implements IView{
    private _catalog : Catalog;
    private _presenter: HTMLElement;
    constructor(broker: IEvents, catalog: Catalog, holder: HTMLElement){
        this._catalog = catalog;
        this._presenter = CatalogView.createPresenter(broker, catalog, holder);
    }

    private static createPresenter(broker: IEvents, catalog: Catalog, parent: HTMLElement) : HTMLElement{
        const cardTemplate = document.querySelector("#card-preview") as HTMLTemplateElement;
        const productViewsItems = catalog.getProducts().map(pr => {
            let card = new ProductCardView(broker, pr, cardTemplate).getRendered();
            card.classList.add(bem("gallery", "item").name);
            return card;
        })
        productViewsItems.forEach(prodView => {
            parent.appendChild(prodView);
        })
        return parent;
    }

    getRendered(): HTMLElement {
        return this._presenter;
    }
} 