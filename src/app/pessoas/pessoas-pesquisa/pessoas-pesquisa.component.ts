import { Component, OnInit, ViewChild } from '@angular/core';
import { PessoaService, PessoaFiltro } from '../pessoa.service';

import { LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  totalRegistro = 0;
  pessoas = [];
  pessoaFiltro = new PessoaFiltro();
  @ViewChild('tabela', {static: true}) grid;

  constructor(
    private pessoaService: PessoaService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private erroHandler: ErrorHandlerService,
    private title: Title
    ) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
  }

  pesquisar(pagina = 0) {
    this.pessoaFiltro.pagina = pagina;

    this.pessoaService.pesquisar(this.pessoaFiltro)
      .then(response => {
        this.pessoas = response.content;
        this.totalRegistro = response.totalElements;
      })
      .catch(erro => this.erroHandler.handler(erro));
  }

  listar() {
    this.pessoaService.listar()
      .then(() => null);
  }

  alterarStatus(pessoa: any) {
    const status = !pessoa.ativo;
    this.pessoaService.mudarStatus(pessoa.codigo, status)
      .then(() => {
        this.grid.first = 0;
        this.toasty.success('Status alterado com sucesso!');
        this.pesquisar();
      })
      .catch(erro => this.erroHandler.handler(erro));
  }

  confirmaExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar();
        this.toasty.success('Pessoa excluida com sucesso!');
      })
      .catch(erro => this.erroHandler.handler(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }
}
