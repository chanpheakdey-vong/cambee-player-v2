import { Component, EventEmitter, Output } from '@angular/core';
import { MsgBox } from '../model/msg-box';

@Component({
    selector: 'msg-box',
    templateUrl: './msg-box.component.html'
})
export class MsgBoxComponent{
    @Output() close = new EventEmitter<boolean>();
    msg: MsgBox = new MsgBox();
    show: boolean = false
    constructor(){}

    setShow(value: boolean){
        this.show = value;
    }
    
    onClose(){
        this.setShow(false);
        this.close.emit();
    }
}