import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChooseLevelModule } from './choose-level/choose-level.module';
import { ChooseSetModule } from './choose-set/choose-set.module';
import { CompetitionModule } from './competition/competition.module';
import { CompleteLearnSetModule } from './complete-learn-set/complete-learn-set.module';
import { CompletePracticeSetModule } from './complete-practice-set/complete-practice-set.module';
import { AuthInterceptor } from './config/auth.interceptor';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { LearnPracticeModule } from './learn-practice/learn-practice.module';
import { LearningSetModule } from './learning-set/learning-set.module';
import { PracticeSetModule } from './practice-set/practice-set.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChooseLevelModule,
    LearnPracticeModule,
    ChooseSetModule,
    LearningSetModule,
    CompleteLearnSetModule,
    PracticeSetModule,
    CompletePracticeSetModule,
    LeaderboardModule,
    CompetitionModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
