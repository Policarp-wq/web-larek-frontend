import { bem, createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Catalog } from "../models/catalog";
import { CatalogProductView, CatalogProductViewFactory } from "./catalogProductView";
import { IView } from "./iview";
import { ProductFullView, ProductFullViewFactory } from "./productCardView";
import { IViewFactory } from "./viewFactory";

export class CatalogView implements IView{
    private _presenter: HTMLElement;
    private _cardFactory: IViewFactory<CatalogProductView>;
    constructor(catalog: Catalog, holder: HTMLElement, cardFactory: IViewFactory<CatalogProductView>){
        this._presenter = holder;
        this._cardFactory = cardFactory;
        this.fill(catalog);
    }

    private fill(catalog: Catalog){
        const productViewsItems = catalog
        .getProducts()
        .map(pr => this._cardFactory.getView(pr));
        productViewsItems.forEach(prodView => {
            this._presenter.appendChild(prodView.getRendered());
        })
    }

    getRendered(): HTMLElement {
        return this._presenter;
    }
} 