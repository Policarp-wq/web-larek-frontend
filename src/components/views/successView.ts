import { SuccessOrder } from "../../types";
import { bem, cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";
import { ViewFactory } from "./viewFactory";

export class SuccessViewFactory extends ViewFactory<SuccessView>{
    constructor(broker: IEvents, template: HTMLTemplateElement){
        super(broker, template);
    }

    getView(order: SuccessOrder): SuccessView {
        const view = new SuccessView();
        const presenter = cloneTemplate<HTMLDivElement>(this._template);
        view.description = presenter.querySelector(bem("order-success", "description").class);
        view.closeBtn = presenter.querySelector(bem("order-success", "close").class);

        view.description.textContent = `Списано ${order.total} синапсов`;
        view.closeBtn.addEventListener('click', () =>{
            this._broker.emit(SuccessView.SuccessCloseEvent);
        });
        view.holder = presenter;
        return view;
    }
}

export class SuccessView implements IView{
    holder: HTMLDivElement;
    description: HTMLParagraphElement;
    closeBtn: HTMLButtonElement;
    public static SuccessCloseEvent = "success:close";

    getRendered(): HTMLElement {
        return this.holder;
    }
}