import { OrderDeliveryInfo } from "../../types";
import { bem, cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";
import { ToggleButtons } from "./toggleButtons";

export class OrderView implements IView{
    private _presenter: HTMLFormElement;
    private _broker: IEvents;
    private _addressField: HTMLInputElement;
    private _continueBtn: HTMLButtonElement;
    private _error: HTMLSpanElement;
    private _toggler: ToggleButtons;

    private payment: "cash" | "online" | null = null;
    public static OrderContinueEvent = "order:continue";
    constructor(broker: IEvents, template: HTMLTemplateElement){
        this._broker = broker;
        this._presenter = this.createPresenter(template);
    }
    private createPresenter(template: HTMLTemplateElement) : HTMLFormElement{
        const presenter = cloneTemplate<HTMLFormElement>(template);
        this._error = presenter.querySelector(bem("form", "errors").class);

        this._addressField = presenter.querySelector(bem("form", "input").class);
        this._addressField.addEventListener("input", () => this.inputUpdated());

        this._continueBtn = presenter.querySelector(bem("order", "button").class) as HTMLButtonElement;
        this._continueBtn.addEventListener('click', () => {
            this._broker.emit(OrderView.OrderContinueEvent, this.getDeliveryInfo())
        })
        const buttons = presenter.querySelector(".order__buttons").querySelectorAll(".button") as NodeListOf<HTMLButtonElement>;
        const toggler = new ToggleButtons(...buttons.values())
        buttons.forEach(btn => {
            btn.addEventListener('click', (evt) =>{
                toggler.toggle(btn, (disabled) =>{
                    disabled.classList.add("button_alt-active");
                    this.payment = disabled.name as ("cash" | "online");
                },
                (enabled) =>{
                    enabled.classList.remove("button_alt-active")
                }
                );
                this.inputUpdated();
            })
        })
        this._toggler = toggler;
        this.inputUpdated();
        return presenter;
    }
    private isValid(): boolean{
        return this._addressField.value.length > 0 && this.payment != null;
    }
    private inputUpdated(){
        this._error.textContent = "";
        const valid = this.isValid();
        this._continueBtn.disabled = !valid
        if(!valid){
            if(this.payment == null){
                this._error.textContent += "Тип доставки должен быть выбран. ";
            }
            if(this._addressField.value.length == 0){
                this._error.textContent += "Поле адреса не должно быть пустым";
            }
        }
    }
    getDeliveryInfo() : OrderDeliveryInfo{
        return {
            address: this._addressField.value,
            payment: this.payment
        }
    }
    getRendered(): HTMLElement {
        return this._presenter;
    }
}