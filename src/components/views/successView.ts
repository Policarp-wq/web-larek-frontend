import { bem, cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";

export class SuccessView implements IView{
    private _presenter: HTMLDivElement;
    private _broker: IEvents;
    private _total: number;
    public static SuccessCloseEvent = "success:close";
    constructor(broker: IEvents, template: HTMLTemplateElement, total: number){
        this._broker = broker;
        this._total = total;
        this._presenter = this.createPresenter(template);
    }
    private createPresenter(template: HTMLTemplateElement){
        const presenter = cloneTemplate<HTMLDivElement>(template);
        presenter.querySelector(bem("order-success", "description").class).textContent = `Списано ${this._total} синапсов`;
        (presenter.querySelector(bem("order-success", "close").class) as HTMLButtonElement)
            .addEventListener('click', (evt) =>{
                this._broker.emit(SuccessView.SuccessCloseEvent);
            })
        return presenter;
    }
    getRendered(): HTMLElement {
        return this._presenter;
    }
}