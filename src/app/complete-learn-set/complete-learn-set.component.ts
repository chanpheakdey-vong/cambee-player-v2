import { Location } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: 'complete-learn-set',
    templateUrl: './complete-learn-set.component.html'
})
export class CompleteLearnSetComponent {
    constructor(private location: Location) {
    }

    back() {
        this.location.back();
    }
}