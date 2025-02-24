import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/larekApi';
import { Basket } from './components/models/basket';
import { Catalog } from './components/models/catalog';
import { BasketView } from './components/views/basketView';
import { CatalogProductView } from './components/views/catalogProductView';
import { CatalogView } from './components/views/catalogView';
import { ModalWindow } from './components/views/modalwindow';
import { OrderView } from './components/views/orderVIew';
import { ProductCardView } from './components/views/productCardView';
import './scss/styles.scss';
import { ProductItem } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketItemTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");


const modalWindowContainer = ensureElement<HTMLElement>("#modal-container");



const larek = new LarekApi(API_URL);
const broker = new EventEmitter();

const modalWindow : ModalWindow = new ModalWindow(broker, modalWindowContainer);

const basket = new Basket(broker);
const basketView = new BasketView(broker, basket, basketTemplate, basketItemTemplate);

const basketButton = ensureElement<HTMLButtonElement>(".header__basket");
basketButton.addEventListener('click', (evt) =>{
    modalWindow.open(basketView);
})

broker.on(ProductCardView.BasketAddedEvent, (product) =>{
    basket.addItem(product as ProductItem);
})

broker.on(ProductCardView.BasketAddedEvent, () =>{
    modalWindow.close();
});

const basketCounter = ensureElement<HTMLSpanElement>(".header__basket-counter");
broker.on(Basket.BasketChangedEvent, () =>{
    basketCounter.textContent = basket.getProdcutsCnt().toString();
})

const orderView = new OrderView(broker, orderTemplate);
broker.on(BasketView.BasketOrderEvent, (products) =>{
    modalWindow.open(orderView);
})

larek.getProductsList().then(ls => {
    ls.items.forEach(it =>{
        it.image = CDN_URL + it.image 
    })
    const catalog = new Catalog(ls.items);
    const catalogView = new CatalogView(broker, catalog, document.querySelector(".gallery"), cardCatalogTemplate);

    broker.on(CatalogProductView.CatalogProductClickedEvent, (product) => {
        const card = new ProductCardView(broker, (product as ProductItem), cardPreviewTemplate);
        modalWindow.open(card)
    });
})