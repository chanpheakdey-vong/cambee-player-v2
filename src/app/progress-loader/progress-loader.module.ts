import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProgressLoaderComponent } from './progress-loader.component';

@NgModule({
  declarations: [
    ProgressLoaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ProgressLoaderComponent]
})
export class ProgressLoaderModule { }
