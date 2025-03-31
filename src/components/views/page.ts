import { bem } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";
import { ModalWindow } from "./modalwindow";

export class Page{
    private _wrapper: HTMLDivElement;
    constructor(private _broker: IEvents){
        this._wrapper = document.querySelector(bem("page", "wrapper").class);
        _broker.on(ModalWindow.ModalOpenedEvent, () => this.lock());
        _broker.on(ModalWindow.ModalClosedEvent, () => this.unlock());
    }
    private lock(){
        this._wrapper.classList.add('page__wrapper_locked');
    }
    private unlock(){
        this._wrapper.classList.remove('page__wrapper_locked');
    }
}