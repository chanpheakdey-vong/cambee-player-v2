import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompletePracticeSetModule } from '../complete-practice-set/complete-practice-set.module';
import { LoaderNoBGModule } from '../loader-no-bg/loader-no-bg.module';
import { LoaderModule } from '../loader/loader.module';
import { MsgBoxModule } from '../msg-box/msg-box.module';
import { RetryModule } from '../retry/retry.module';
import { PracticeSetComponent } from './practice-set.component';

@NgModule({
  declarations: [
    PracticeSetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CompletePracticeSetModule,
    LoaderModule,
    MsgBoxModule,
    LoaderNoBGModule,
    RetryModule
  ],
  exports: [PracticeSetComponent]
})
export class PracticeSetModule { }
