import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavHeaderComponent } from './nav-header.component';

@NgModule({
  declarations: [
    NavHeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [NavHeaderComponent]
})
export class NavHeaderModule { }
