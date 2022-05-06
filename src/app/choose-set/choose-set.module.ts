import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { LoaderNoBGModule } from '../loader-no-bg/loader-no-bg.module';
import { MsgBoxModule } from '../msg-box/msg-box.module';
import { RetryModule } from '../retry/retry.module';
import { ChooseSetComponent } from './choose-set.component';

@NgModule({
  declarations: [
    ChooseSetComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MsgBoxModule,
    LoaderNoBGModule,
    RetryModule
  ],
  exports: [ChooseSetComponent]
})
export class ChooseSetModule { }
