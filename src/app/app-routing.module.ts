import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseLevelComponent } from './choose-level/choose-level.component';
import { ChooseSetComponent } from './choose-set/choose-set.component';
import { CompetitionComponent } from './competition/competition.component';
import { CompleteLearnSetComponent } from './complete-learn-set/complete-learn-set.component';
import { CompletePracticeSetComponent } from './complete-practice-set/complete-practice-set.component';
import { LevelGuard } from './config/level-guard';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LearnPracticeComponent } from './learn-practice/learn-practice.component';
import { LearningSetComponent } from './learning-set/learning-set.component';
import { PracticeSetComponent } from './practice-set/practice-set.component';

const routes: Routes = [
  { path: 'choose-level', component: ChooseLevelComponent, canActivate: [LevelGuard] },
  { path: 'learn-practice', component: LearnPracticeComponent, canActivate: [LevelGuard] },
  { path: 'choose-set', component: ChooseSetComponent, canActivate: [LevelGuard] },
  { path: 'learning-set', component: LearningSetComponent, canActivate: [LevelGuard] },
  { path: 'complete-learn-set', component: CompleteLearnSetComponent, canActivate: [LevelGuard] },
  { path: 'practice-set', component: PracticeSetComponent, canActivate: [LevelGuard] },
  { path: 'complete-practice-set', component: CompletePracticeSetComponent, canActivate: [LevelGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [LevelGuard] },
  { path: 'competition', component: CompetitionComponent },
  { path: '**', redirectTo: '/competition' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [LevelGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
