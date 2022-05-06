import { Injectable } from "@angular/core";
import { DynamicType } from "../model/dynamic-type";

@Injectable({ providedIn: 'root' })
export class ScrollService{
    scrolls: DynamicType = {};
    
    constructor(){}

    getScroll(name: string){
        if (name == undefined || name.trim() == "") return 0;
        const scroll = this.scrolls[name];
        return scroll == undefined ? 0 : scroll;
    }

    setScroll(name: string, value: number){
        if (name == undefined || name.trim() == "") return;
        this.scrolls[name] = value;
    }
}