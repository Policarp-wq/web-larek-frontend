import { OrderDeliveryInfo } from "../../types";
import { bem, cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";
import { ModalWindow } from "./modalwindow";
import { ToggleButtons } from "./toggleButtons";
import { ViewFactory } from "./viewFactory";

export class OrderViewFactory extends ViewFactory<OrderView>{
    constructor(broker: IEvents, template: HTMLTemplateElement){
        super(broker, template);
    }
    getView(): OrderView {
        const view = new OrderView();
        const presenter = cloneTemplate<HTMLFormElement>(this._template);
        view.error = presenter.querySelector(bem("form", "errors").class);

        view.addressField = presenter.querySelector(bem("form", "input").class);
        view.addressField.addEventListener("input", () => view.inputUpdated());

        view.continueBtn = presenter.querySelector(bem("order", "button").class);
        view.continueBtn.addEventListener('click', () => {
            this._broker.emit(OrderView.OrderContinueEvent, view.getDeliveryInfo())
            view.clear();
        })

        const buttons = presenter.querySelector(".order__buttons").querySelectorAll(".button") as NodeListOf<HTMLButtonElement>;
        view.toggler = new ToggleButtons(...buttons.values());
        buttons.forEach(btn => {
            btn.addEventListener('click', () =>{
                view.toggler.toggle(btn, (disabled) =>{
                    disabled.classList.add("button_alt-active");
                    view.payment = disabled.name as ("cash" | "online");
                },
                (enabled) =>{
                    enabled.classList.remove("button_alt-active")
                }
                );
                view.inputUpdated();
            })
        })
        this._broker.on(ModalWindow.ModalClosedEvent, () =>{
            view.clear();
        });
        view.holder = presenter;
        view.inputUpdated();
        return view;
    }
}

export class OrderView implements IView{
    holder: HTMLFormElement;
    broker: IEvents;
    addressField: HTMLInputElement;
    continueBtn: HTMLButtonElement;
    error: HTMLSpanElement;
    toggler: ToggleButtons;
    payment: "cash" | "online" | null = null;
    public static OrderContinueEvent = "order:continue";

    clear(){
        this.addressField.value = "";
        this.toggler.toggle(null);
        this.payment = null;
    }
    isValid(): boolean{
        return this.addressField.value.length > 0 && this.payment != null;
    }
    inputUpdated(){
        this.error.textContent = "";
        const valid = this.isValid();
        this.continueBtn.disabled = !valid
        if(!valid){
            if(this.payment == null){
                this.error.textContent += "Тип доставки должен быть выбран. ";
            }
            if(this.addressField.value.length == 0){
                this.error.textContent += "Поле адреса не должно быть пустым";
            }
        }
    }
    getDeliveryInfo() : OrderDeliveryInfo{
        return {
            address: this.addressField.value,
            payment: this.payment
        }
    }
    getRendered(): HTMLElement {
        return this.holder;
    }
}