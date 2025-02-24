import { bem, createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Catalog } from "../models/catalog";
import { CatalogProductView } from "./catalogProductView";
import { IView } from "./iview";
import { ProductCardView } from "./productCardView";

export class CatalogView implements IView{
    private _catalog : Catalog;
    private _presenter: HTMLElement;
    constructor(broker: IEvents, catalog: Catalog, holder: HTMLElement, cardTemplate : HTMLTemplateElement){
        this._catalog = catalog;
        this._presenter = CatalogView.createPresenter(broker, catalog, holder, cardTemplate);
    }

    private static createPresenter(broker: IEvents, catalog: Catalog, parent: HTMLElement, cardTemplate : HTMLTemplateElement) : HTMLElement{
        const productViewsItems = catalog.getProducts().map(pr => {
            let card = new CatalogProductView(broker, pr, cardTemplate).getRendered();
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