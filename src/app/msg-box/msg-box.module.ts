import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { MsgBoxComponent } from './msg-box.component';

@NgModule({
  declarations: [
    MsgBoxComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [MsgBoxComponent]
})
export class MsgBoxModule { }
