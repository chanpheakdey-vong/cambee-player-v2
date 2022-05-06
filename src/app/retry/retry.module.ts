import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RetryComponent } from './retry.component';

@NgModule({
  declarations: [
    RetryComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [RetryComponent]
})
export class RetryModule { }
