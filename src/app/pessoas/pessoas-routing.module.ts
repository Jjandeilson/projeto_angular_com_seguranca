import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [
  { path: 'pessoas',
    component: PessoasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { role: ['ROLE_PESQUISAR_PESSOA']}
  },
  { path: 'pessoas/novo',
    component: PessoaCadastroComponent,
    canActivate: [AuthGuard],
    data: { role: ['ROLE_CADASTRO_PESSOA']}
  },
  { path: 'pessoas/:codigo',
    component: PessoaCadastroComponent,
    canActivate: [AuthGuard],
    data: { role: ['ROLE_PESQUISAR_PESSOA']}
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PessoasRoutingModule { }
