import { Component, EventEmitter, Output } from '@angular/core';
import { DynamicType } from '../model/dynamic-type';
import { MsgBox } from '../model/msg-box';

@Component({
    selector: 'confirm-box',
    templateUrl: './confirm-box.component.html'
})
export class ConfirmComponent{
    @Output() confirmYes = new EventEmitter<boolean>();
    msg: MsgBox = new MsgBox();
    show: boolean = false;
    confirm: DynamicType = {
        text: "Okay",
        status: ""
    }
    constructor(){}

    setShow(value: boolean){
        this.show = value;
    }

    onConfirm(){
        this.confirmYes.emit();
    }
}