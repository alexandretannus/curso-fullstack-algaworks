import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,

    SharedModule,
    PanelModule,
    ChartModule,

    DashboardRoutingModule

  ],
  providers: [
    DecimalPipe
  ]
})
export class DashboardModule { }
