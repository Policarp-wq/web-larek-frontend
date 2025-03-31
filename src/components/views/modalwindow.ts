import { bem } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IDisposable } from "./idisposable";
import { IView } from "./iview";

export interface IModalWindow{
    Container: HTMLElement;
    open(child : IView): void;
    close(): void;
}

export interface IModalDisplayable extends IView, IDisposable{}

export class ModalWindow implements IModalWindow{
    Container: HTMLElement;
    _current: IModalDisplayable = null;
    private _broker: IEvents;
    private _contentElementHolder: HTMLElement;
    public static ModalOpenedEvent: string = "modal:opened";
    public static ModalClosedEvent: string = "modal:closed";
    constructor(broker :IEvents, container: HTMLElement){
        this.Container = container;
        this._broker = broker;
        try{
            (this.Container.querySelector(bem("modal", "close").class) as HTMLButtonElement)
                .addEventListener('click', () => this.close());
        }
        catch(err){
            console.error("Failed to add event listener to modal opener");
        }
        try{
            this._contentElementHolder = this.Container.querySelector(bem("modal", "content").class);
        }
        catch(err){
            console.error(err);
        }
        this._broker.on("clicked:outside_modal", () => this.close())
        
    }
    open(child : IModalDisplayable): void {
        this.close();
        if(!this._contentElementHolder){
            console.error("Content element holder is not assigned!");
            return;
        }
        this._current = child;
        this._contentElementHolder.appendChild(this._current.getRendered());
        this.Container.classList.add("modal_active");
        this._broker.emit(ModalWindow.ModalOpenedEvent);

    }
    close(): void {
        this.Container.classList.remove("modal_active");
        this._current?.dispose();
        this._contentElementHolder.innerHTML = "";
        this._broker.emit(ModalWindow.ModalClosedEvent);
    }
}