import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderSMComponent } from './loader-sm.component';

@NgModule({
  declarations: [
    LoaderSMComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [LoaderSMComponent]
})
export class LoaderSMModule { }
