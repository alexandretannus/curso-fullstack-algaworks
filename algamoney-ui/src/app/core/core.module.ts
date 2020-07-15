import { DashboardService } from './../dashboard/dashboard.service';
import { RelatoriosService } from './../relatorios/relatorios.service';
import { AuthService } from './../seguranca/auth.service';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ErrorHandlerService } from './error-handler.service';
import { CategoriaService } from './../categorias/categoria.service';
import { PessoaService } from '../pessoas/pessoa.service';
import { LancamentoService } from '../lancamentos/lancamento.service';

import { NavbarComponent } from './navbar/navbar.component';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastyModule } from 'ng2-toasty';
import { ConfirmationService } from 'primeng/api';
import { NotFoundPageComponent } from './not-found-page.component';
import { NaoAutorizadoPageComponent } from './nao-autorizado-page.component';


@NgModule({
  declarations: [
    NavbarComponent,
    NotFoundPageComponent,
    NaoAutorizadoPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    ConfirmDialogModule,
    ToastyModule.forRoot(),
  ],
  exports: [
    NavbarComponent,
    ToastyModule,
    ConfirmDialogModule
  ],
  providers: [
    ConfirmationService,

    ErrorHandlerService,

    AuthService,
    CategoriaService,
    DashboardService,
    LancamentoService,
    PessoaService,
    RelatoriosService,

    Title
  ]
})
export class CoreModule { }
