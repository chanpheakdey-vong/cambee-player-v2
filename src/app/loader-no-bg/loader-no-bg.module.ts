import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderNoBGComponent } from './loader-no-bg.component';

@NgModule({
  declarations: [
    LoaderNoBGComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [LoaderNoBGComponent]
})
export class LoaderNoBGModule { }
