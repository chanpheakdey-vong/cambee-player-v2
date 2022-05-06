import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../loader/loader.module';
import { MsgBoxModule } from '../msg-box/msg-box.module';
import { ProgressLoaderModule } from '../progress-loader/progress-loader.module';
import { RetryModule } from '../retry/retry.module';
import { CompetitionComponent } from './competition.component';

@NgModule({
  declarations: [
    CompetitionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProgressLoaderModule,
    RetryModule,
    MsgBoxModule,
    LoaderModule
  ],
  exports: [CompetitionComponent]
})
export class CompetitionModule { }
