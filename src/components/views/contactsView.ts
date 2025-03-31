import { ContactInfo } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IDisposable } from "./idisposable";
import { IView } from "./iview";
import { ModalWindow } from "./modalwindow";
import { ViewFactory } from "./viewFactory";

export class ContactsViewFactory extends ViewFactory<ContactsView>{
    constructor(broker: IEvents, template: HTMLTemplateElement){
        super(broker, template);
    }
    getView(): ContactsView {
        const view = new ContactsView();
        view.holder = cloneTemplate<HTMLFormElement>(this._template);
        const inputs = view.holder.querySelectorAll(".form__input") as NodeListOf<HTMLInputElement>;
        inputs.forEach(input =>{
            if(input.name === "email"){
                view.emailInput = input;
            }
            if(input.name === "phone"){
                view.phoneInput = input;
            }
            input.addEventListener('input', () => view.inputChanged());
        });
        const acts = view.holder.querySelector(".modal__actions");

        view.error = acts.querySelector(".form__errors");
        view.submit = acts.querySelector(".button");

        view.holder.addEventListener('submit', (evt) =>{
            evt.preventDefault(); 
            this._broker.emit(ContactsView.ContactsAddedEvent, view.getContacts());
            view.clear();
        })
        this._broker.on(ModalWindow.ModalClosedEvent, () =>{
            view.clear();
        })
        view.inputChanged();
        return view;
    }
}

export class ContactsView implements IView, IDisposable{
    holder: HTMLFormElement;
    broker: IEvents;
    emailInput: HTMLInputElement;
    phoneInput: HTMLInputElement;
    error: HTMLSpanElement;
    submit: HTMLButtonElement;

    public static ContactsAddedEvent = "contacts:added"


    private isValid() : boolean{
        return this.emailInput.value.length > 0 && this.phoneInput.value.length > 0;
    }
    dispose(): void {
        this.holder.remove();
    }

    inputChanged(){
        this.error.textContent = "";
        const valid = this.isValid();
        this.submit.disabled = !valid;
        if(!valid){
            if(this.emailInput.value.length == 0){
                this.error.textContent += "Почта должна быть прописана. ";
            }
            if(this.phoneInput.value.length == 0){
                this.error.textContent += "Телефон должен быть указан";
            }
        }
    }

    getContacts() : ContactInfo{ 
        if(!this.isValid)
            throw new Error("Attemp to get contact info on invalid form");
        return {
            phone: this.phoneInput.value,
            email: this.emailInput.value
        }
    }

    clear(){
        this.phoneInput.value = "";
        this.emailInput.value = "";
    }

    getRendered(): HTMLElement {
        return this.holder;
    }
}