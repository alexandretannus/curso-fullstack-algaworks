import { NaoAutorizadoPageComponent } from './core/nao-autorizado-page.component';
import { NotFoundPageComponent } from './core/not-found-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [

  {
    path: 'lancamentos',
    loadChildren: () => import('./lancamentos/lancamentos.module')
      .then(mod => mod.LancamentosModule)
  },
  {
    path: 'pessoas',
    loadChildren: () => import('./pessoas/pessoas.module')
      .then(mod => mod.PessoasModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(mod => mod.DashboardModule)
  },
  {
    path: 'relatorios',
    loadChildren: () => import('./relatorios/relatorios.module')
      .then(mod => mod.RelatoriosModule)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'not-found', component: NotFoundPageComponent },
  { path: 'nao-autorizado', component: NaoAutorizadoPageComponent },
  { path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
