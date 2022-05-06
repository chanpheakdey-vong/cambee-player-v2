import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { LeaderboardComponent } from './leaderboard.component';

@NgModule({
  declarations: [
    LeaderboardComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [LeaderboardComponent]
})
export class LeaderboardModule { }
