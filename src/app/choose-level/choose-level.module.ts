import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { LoaderNoBGModule } from '../loader-no-bg/loader-no-bg.module';
import { MsgBoxModule } from '../msg-box/msg-box.module';
import { RetryModule } from '../retry/retry.module';
import { ChooseLevelComponent } from './choose-level.component';

@NgModule({
  declarations: [
    ChooseLevelComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MsgBoxModule,
    RetryModule,
    LoaderNoBGModule
  ],
  exports: [ChooseLevelComponent]
})
export class ChooseLevelModule { }
