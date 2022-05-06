import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DynamicType } from "../model/dynamic-type";
import { LevelService } from "../model/level.service";
import { MsgBoxComponent } from "../msg-box/msg-box.component";
import { SetService } from "../model/set.service";

@Component({
    selector: 'choose-level',
    templateUrl: './choose-level.component.html'
})
export class ChooseLevelComponent {
    @ViewChild("msgBox") msgBox = new MsgBoxComponent();
    constructor(public level: LevelService, public set: SetService, private router: Router) {
    }

    selectLevel(l: DynamicType, idx: number) {
        if (this.level.isEnable(idx)) {
            this.router.navigate(['/learn-practice'], { queryParams: {level: l.id}, queryParamsHandling: "merge" });
        } else {
            this.msgBox.msg.msg = "Please complete all the unlocked levels to unlock this level.";
            this.msgBox.setShow(true);
        }
    }
}