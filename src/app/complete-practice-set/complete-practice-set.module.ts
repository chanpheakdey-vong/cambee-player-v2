import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CompletePracticeSetComponent } from './complete-practice-set.component';

@NgModule({
  declarations: [
    CompletePracticeSetComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [CompletePracticeSetComponent]
})
export class CompletePracticeSetModule { }
