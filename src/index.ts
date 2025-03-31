import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/larekApi';
import { Basket, BasketItem } from './components/models/basket';
import { Catalog } from './components/models/catalog';
import { OrderProcess } from './components/models/orderProcess';
import { BasketItemViewFactory } from './components/views/basketItemView';
import { BasketView, BasketViewFactory } from './components/views/basketView';
import { CatalogProductView, CatalogProductViewFactory } from './components/views/catalogProductView';
import { CatalogView } from './components/views/catalogView';
import { ContactsView, ContactsViewFactory } from './components/views/contactsView';
import { ModalWindow } from './components/views/modalwindow';
import { OrderView, OrderViewFactory } from './components/views/orderVIew';
import { Page } from './components/views/page';
import { ProductFullView, ProductFullViewFactory } from './components/views/productCardView';
import { SuccessView, SuccessViewFactory } from './components/views/successView';
import './scss/styles.scss';
import { BasketInfo, ContactInfo, OrderDeliveryInfo, ProductItem } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

function handleOutsideModalClicked(evt: MouseEvent){
        const targetElement = evt.target as HTMLElement;
        if(targetElement.classList.contains("basket__item-delete"))
            return;
        if(!targetElement.closest(".modal__container")){
            broker.emit("clicked:outside_modal")
        }
}

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const productFullTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketItemTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");


const modalWindowContainer = ensureElement<HTMLElement>("#modal-container");

const larek = new LarekApi(API_URL);
const broker = new EventEmitter();

const modalWindow = new ModalWindow(broker, modalWindowContainer);
const page = new Page(broker);
const order: OrderProcess = new OrderProcess();
const basket = new Basket(broker);


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

broker.on(ProductFullView.BasketAddedEvent, (product) =>{
    basket.addItem(product as ProductItem);
})

broker.on(ProductFullView.BasketAddedEvent, () =>{
    modalWindow.close();
});

const basketCounter = ensureElement<HTMLSpanElement>(".header__basket-counter");
broker.on(Basket.BasketChangedEvent, () =>{
    basketCounter.textContent = basket.getProdcutsCnt().toString();
})

broker.on(SuccessView.SuccessCloseEvent, () => {
    modalWindow.close();
})



const basketItemViewFactory = new BasketItemViewFactory(broker, basketItemTemplate);

const factories = {
    catalogProductViewFactory: new CatalogProductViewFactory(broker, cardCatalogTemplate),
    productFullViewFactory: new ProductFullViewFactory(broker, productFullTemplate),
    contactsViewFactory: new ContactsViewFactory(broker, contactsTemplate),
    basketItemViewFactory: basketItemViewFactory,
    basketViewFactory: new BasketViewFactory(broker, basketTemplate, basketItemViewFactory),
    orderViewFactory: new OrderViewFactory(broker, orderTemplate),
    successViewFactory: new SuccessViewFactory(broker, successTemplate),
}
const basketView = factories.basketViewFactory.getView(basket);

const orderView = factories.orderViewFactory.getView();
broker.on(BasketView.BasketOrderEvent, (basketInfo: BasketInfo) =>{
    order.clear();
    order.addBasketInfo(basketInfo);
    modalWindow.open(orderView);
})

const contacts = factories.contactsViewFactory.getView();
broker.on(OrderView.OrderContinueEvent, (orderInfo: OrderDeliveryInfo) => {
    order.addDeliveryInfo(orderInfo);
    modalWindow.open(contacts);
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
        const successView = factories.successViewFactory.getView(success);
        basket.clear();
        modalWindow.open(successView);
    }).catch(err => {
        console.error(err);
    })
    
})

broker.on(CatalogProductView.CatalogProductClickedEvent, (product : ProductItem) => {
    modalWindow.open(factories.productFullViewFactory.getView({product: product, available: !basket.contains(product.id)}))
});


larek.getProductsList().then(ls => {
    ls.items.forEach(it =>{
        it.image = CDN_URL + it.image 
    })
    const catalog = new Catalog(ls.items);
    const catalogView = new CatalogView(catalog, document.querySelector(".gallery"), factories.catalogProductViewFactory);


}).catch(err => {
    console.error(err);
})