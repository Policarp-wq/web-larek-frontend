import { BasketInfo, ContactInfo, Order, OrderDeliveryInfo } from "../../types";

export class OrderProcess{
    private _deliveryInfo?: OrderDeliveryInfo;
    private _contactInfo?: ContactInfo;
    private _basketInfo?: BasketInfo;
    constructor(){}
    addDeliveryInfo(deliveryInfo: OrderDeliveryInfo){
        this.clear();
        this._deliveryInfo = deliveryInfo;
    }
    addContactInfo(contactInfo: ContactInfo){
        this._basketInfo = null;
        this._contactInfo = contactInfo;
    }
    addBasketInfo(basketInfo: BasketInfo){
        this._basketInfo = basketInfo;
    }

    getOrder(): Order{
        if(this._deliveryInfo &&this._contactInfo && this._basketInfo)
            return {
                payment: this._deliveryInfo.payment,
                email: this._contactInfo.email,
                phone: this._contactInfo.phone,
                address: this._deliveryInfo.address,
                total: this._basketInfo.total,
                items: this._basketInfo.items
            }
        console.error("Attempt to get not full order");
        return null;
    }

    clear(){
        this._deliveryInfo = null;
        this._contactInfo = null;
        this._basketInfo = null;
    }
}