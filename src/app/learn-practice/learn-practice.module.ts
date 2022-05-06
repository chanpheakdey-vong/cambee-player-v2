import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { LearnPracticeComponent } from './learn-practice.component';

@NgModule({
  declarations: [
    LearnPracticeComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [LearnPracticeComponent]
})
export class LearnPracticeModule { }
