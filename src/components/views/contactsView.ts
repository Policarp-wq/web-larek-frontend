import { ContactInfo } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";

export class ContactsView implements IView{
    private _presenter: HTMLFormElement;
    private _broker: IEvents;
    private _emailInput: HTMLInputElement;
    private _phoneInput: HTMLInputElement;
    private _error: HTMLSpanElement;
    private _submit: HTMLButtonElement;

    public static ContactsAddedEvent = "contacts:added"
    constructor(broker: IEvents, template: HTMLTemplateElement){
        this._broker = broker;
        this._presenter = this.createPresenter(template);
    }
    private createPresenter(template: HTMLTemplateElement) : HTMLFormElement{
        const presenter = cloneTemplate<HTMLFormElement>(template);
        const inputs = presenter.querySelectorAll(".form__input") as NodeListOf<HTMLInputElement>;
        inputs.forEach(input =>{
            if(input.name === "email"){
                this._emailInput = input;
            }
            if(input.name === "phone"){
                this._phoneInput = input;
            }
            input.addEventListener('input', () => this.inputChanged());
        });
        const acts = presenter.querySelector(".modal__actions");
        this._error = acts.querySelector(".form__errors");
        this._submit = acts.querySelector(".button");
        this.inputChanged();
        presenter.addEventListener('submit', (evt =>{
            evt.preventDefault(); 
            this._broker.emit(ContactsView.ContactsAddedEvent, this.getContacts());
            this.clear();
        }))
        return presenter;
    }

    private isValid() : boolean{
        return this._emailInput.value.length > 0 && this._phoneInput.value.length > 0;
    }

    private inputChanged(){
        this._error.textContent = "";
        const valid = this.isValid();
        this._submit.disabled = !valid;
        if(!valid){
            if(this._emailInput.value.length == 0){
                this._error.textContent += "Почта должна быть прописана. ";
            }
            if(this._phoneInput.value.length == 0){
                this._error.textContent += "Телефон должен быть указан";
            }
        }
    }

    private getContacts() : ContactInfo{ 
        if(!this.isValid)
            throw new Error("Attemp to get contact info on invalid form");
        return {
            phone: this._phoneInput.value,
            email: this._emailInput.value
        }
    }

    private clear(){
        this._phoneInput.value = "";
        this._emailInput.value = "";
    }

    getRendered(): HTMLElement {
        return this._presenter;
    }
}