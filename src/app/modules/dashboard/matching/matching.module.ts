import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchingRoutingModule } from './matching-routing.module';
import { MatchingMainComponent } from './pages/matching-main/matching-main.component';


@NgModule({
  declarations: [MatchingMainComponent],
  imports: [
    CommonModule,
    MatchingRoutingModule
  ]
})
export class MatchingModule { }
