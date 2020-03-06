import { Component, OnInit, ViewChild } from '@angular/core';

import { LancamentoService, LancamentoFilter } from '../lancamento.service';
import { LazyLoadEvent, ConfirmationService } from 'primeng/api';

import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new LancamentoFilter();
  lancamentos = [];
  @ViewChild('tabela', {static: true}) grid;

  constructor(
    private lancamentoService: LancamentoService,
    private toastyService: ToastyService,
    private confirmation: ConfirmationService,
    private erroHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService
    ) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de Lançamentos');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro)
        .then(response => {
          this.lancamentos = response.content;
          this.totalRegistros = response.totalElements;
        })
        .catch(erro => this.erroHandler.handler(erro));
  }

  excluir(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar();
        this.toastyService.success('Lançamento excluído com sucesso!');
      })
      .catch(erro => this.erroHandler.handler(erro));
  }

  confirmaExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }
}
