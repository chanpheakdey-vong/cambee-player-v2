import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'retry',
    templateUrl: './retry.component.html'
})
export class RetryComponent {
    @Output() retry = new EventEmitter<boolean>();
    constructor(){}

    onRetry(){
        this.retry.emit();
    }
}