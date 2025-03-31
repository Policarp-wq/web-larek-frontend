import { bem } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IView } from "./iview";

export interface IModalWindow{
    Container: HTMLElement;
    open(child : IView): void;
    close(): void;
}

export class ModalWindow implements IModalWindow{
    Container: HTMLElement;
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
    open(child : IView): void {
        this.close();
        if(!this._contentElementHolder){
            console.error("Content element holder is not assigned!");
            return;
        }
        this._contentElementHolder.appendChild(child.getRendered());
        this.Container.classList.add("modal_active");
        this._broker.emit(ModalWindow.ModalOpenedEvent);

    }
    close(): void {
        this.Container.classList.remove("modal_active");
        this._contentElementHolder.innerHTML = "";
        this._broker.emit(ModalWindow.ModalClosedEvent);
    }
}