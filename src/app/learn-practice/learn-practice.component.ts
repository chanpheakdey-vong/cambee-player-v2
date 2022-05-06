import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LevelService } from "../model/level.service";
import { SetService } from "../model/set.service";

@Component({
    selector: 'learn-practice',
    templateUrl: './learn-practice.component.html'
})
export class LearnPracticeComponent {
    level: number = 0;
    constructor(private route: ActivatedRoute, public set: SetService, private levelService: LevelService, public location: Location) {
        this.route.queryParams.subscribe(params => {
            this.level = params["level"];
        });
        if (!this.set.sets[this.level]) {
            this.set.getSet(this.level);
        }
    }

    getLevelName() {
        return this.levelService.levels.filter(l => l.id == this.level)[0].name;
    }
}