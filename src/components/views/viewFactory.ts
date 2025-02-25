import { IEvents } from "../base/events";

export interface IViewFactory<T>{
    getView(data? : any) : T;
}

export abstract class ViewFactory<T> implements IViewFactory<T>{
    protected _broker : IEvents
    protected _template: HTMLTemplateElement;
    constructor(broker: IEvents, template: HTMLTemplateElement){
        this._broker = broker;
        this._template = template;
    }
    abstract getView(data?: any) : T;
}