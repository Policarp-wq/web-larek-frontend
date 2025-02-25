import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/larekApi';
import { Basket, BasketItem } from './components/models/basket';
import { Catalog } from './components/models/catalog';
import { OrderProcess } from './components/models/orderProcess';
import { BasketView } from './components/views/basketView';
import { CatalogProductView } from './components/views/catalogProductView';
import { CatalogView } from './components/views/catalogView';
import { ContactsView } from './components/views/contactsView';
import { ModalWindow } from './components/views/modalwindow';
import { OrderView } from './components/views/orderVIew';
import { ProductCardView } from './components/views/productCardView';
import { SuccessView } from './components/views/successView';
import './scss/styles.scss';
import { BasketInfo, ContactInfo, OrderDeliveryInfo, ProductItem } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

function handleOutsideModalClicked(evt: MouseEvent){
        const targetElement = evt.target as HTMLElement;
        if(!targetElement.closest(".modal__container")){
            broker.emit("clicked:outside_modal")
        }
}

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketItemTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");


const modalWindowContainer = ensureElement<HTMLElement>("#modal-container");

const larek = new LarekApi(API_URL);
const broker = new EventEmitter();

const modalWindow : ModalWindow = new ModalWindow(broker, modalWindowContainer);
const order: OrderProcess = new OrderProcess();
const basket = new Basket(broker);
const basketView = new BasketView(broker, basket, basketTemplate, basketItemTemplate);

broker.on(ModalWindow.ModalOpenedEvent, () =>{
    setTimeout(() => {
        document.body.addEventListener('click', handleOutsideModalClicked);
    }, 0)
    
});

broker.on(ModalWindow.ModalClosedEvent, () =>{
    document.body.removeEventListener('click', handleOutsideModalClicked);
})

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
broker.on(BasketView.BasketOrderEvent, (basketInfo: BasketInfo) =>{
    order.addBasketInfo(basketInfo);
    modalWindow.open(orderView);
})
const contacts = new ContactsView(broker, contactsTemplate);
broker.on(OrderView.OrderContinueEvent, (orderInfo: OrderDeliveryInfo) => {
    order.addDeliveryInfo(orderInfo);
    modalWindow.open(contacts);
})

broker.on(SuccessView.SuccessCloseEvent, () => {
    modalWindow.close();
})

broker.on(ContactsView.ContactsAddedEvent, (contactsInfo: ContactInfo) => {
    order.addContactInfo(contactsInfo);
    const orderResult = order.getOrder();
    if(!orderResult){
        console.error("Not full order!");
        order.clear();
        return;
    }
    modalWindow.close();
    larek.sendOrder(order.getOrder()).then(success => {
        const successView = new SuccessView(broker, successTemplate, success.total);
        basket.clear();
        modalWindow.open(successView);
    }).catch(err => {
        console.error(err);
    })
    
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
}).catch(err => {
    console.error(err);
})