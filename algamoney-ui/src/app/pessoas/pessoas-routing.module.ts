import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { PessoaPesquisaComponent } from './pessoa-pesquisa/pessoa-pesquisa.component';
import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PessoaPesquisaComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        'ROLE_PESQUISAR_PESSOA'
      ]
    }
  },
  {
    path: 'novo',
    component: PessoaCadastroComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        'ROLE_CADASTRAR_PESSOA'
      ]
    }
  },
  {
    path: ':codigo',
    component: PessoaCadastroComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        'ROLE_CADASTRAR_PESSOA'
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PessoasRoutingModule { }
