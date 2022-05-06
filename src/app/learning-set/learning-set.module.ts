import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompleteLearnSetModule } from '../complete-learn-set/complete-learn-set.module';
import { LoaderNoBGModule } from '../loader-no-bg/loader-no-bg.module';
import { LoaderModule } from '../loader/loader.module';
import { MsgBoxModule } from '../msg-box/msg-box.module';
import { RetryModule } from '../retry/retry.module';
import { LearningSetComponent } from './learning-set.component';

@NgModule({
  declarations: [
    LearningSetComponent
  ],
  imports: [
    CommonModule,
    LoaderModule,
    MsgBoxModule,
    CompleteLearnSetModule,
    LoaderNoBGModule,
    RetryModule
  ],
  exports: [LearningSetComponent]
})
export class LearningSetModule { }
