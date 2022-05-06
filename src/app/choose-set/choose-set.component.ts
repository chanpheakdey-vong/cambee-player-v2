import { Location } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DynamicType } from "../model/dynamic-type";
import { SetService } from "../model/set.service";
import { MsgBoxComponent } from "../msg-box/msg-box.component";

@Component({
    selector: 'choose-set',
    templateUrl: './choose-set.component.html'
})
export class ChooseSetComponent {
    @ViewChild("msgBox") msgBox = new MsgBoxComponent();
    level: number = 0;
    type: string = "";

    constructor(public set: SetService, private route: ActivatedRoute, private router: Router, public location: Location) {
        this.route.queryParams.subscribe(params => {
            this.level = params["level"];
            this.type = params["type"];
        });
        if (!this.set.sets[this.level]) {
            this.set.getSet(this.level);
        }
    }

    selectSet(s: DynamicType) {
        if (this.set.isEnable(this.level, s.id, this.type)) {
            if (this.type == "learning") this.router.navigate(['/learning-set'], { queryParams: {set: s.id, setno: s.no}, queryParamsHandling: 'merge' });
            else this.router.navigate(['/practice-set'], { queryParams: {set: s.id, setno: s.no}, queryParamsHandling: 'merge' });
        } else {
            this.msgBox.msg.msg = "Please complete all the unlocked sets to unlock this set.";
            this.msgBox.setShow(true);
        }
    }
}