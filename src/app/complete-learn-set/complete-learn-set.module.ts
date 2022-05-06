import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CompleteLearnSetComponent } from './complete-learn-set.component';

@NgModule({
  declarations: [
    CompleteLearnSetComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [CompleteLearnSetComponent]
})
export class CompleteLearnSetModule { }
