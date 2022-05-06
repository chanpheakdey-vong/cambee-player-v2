import { Component, Input } from "@angular/core";

@Component({
    selector: 'complete-practice-set',
    templateUrl: './complete-practice-set.component.html'
})
export class CompletePracticeSetComponent {
    @Input() minute: number = 0;
    @Input() second: number = 0;
    @Input() backnum: number = 1;

    constructor() {
    }

    back() {
        history.go(this.backnum * -1);
    }
}