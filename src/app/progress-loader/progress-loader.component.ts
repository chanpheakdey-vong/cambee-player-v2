import { Component } from "@angular/core";

@Component({
    selector: 'progress-loader',
    templateUrl: './progress-loader.component.html'
})
export class ProgressLoaderComponent{
    progress: number = 0;
    show: boolean = false;
    constructor(){}

    getOffset() {
        return 440 - 440 * this.progress / 100;
    }
}