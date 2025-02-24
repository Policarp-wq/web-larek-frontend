export class ToggleButtons{
    private _buttons: HTMLButtonElement[];
    constructor(...buttons: HTMLButtonElement[]){
        this._buttons = buttons;
    }
    toggle(button: HTMLButtonElement, onDisable?: (btn: HTMLButtonElement) => void, onEnable?: (btn: HTMLButtonElement) => void){
        this._buttons.forEach(btn =>{
            if(btn == button){
                btn.disabled = true;
                if(onDisable)
                    onDisable(btn);
            }
            else{
                btn.disabled = false;
                if(onEnable)
                    onEnable(btn);  
            } 
        });
    }


}