import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { CategoriaService } from 'src/app/categorias/categoria.service';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { Lancamento } from 'src/app/core/model';
import { LancamentoService } from '../lancamento.service';
import { ToastyService } from 'ng2-toasty';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA'},
    { label: 'Despesa', value: 'DESPESA'}
  ];

  categorias = [];
  pessoas = [];
  lancamento = new Lancamento();

  constructor(
    private categoriaaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit() {
    const codigo = this.route.snapshot.params[('codigo')];
    this.title.setTitle('Novo Lançamento');

    if (codigo) {
      this.buscarPorCodigo(codigo);
    }

    this.listaDeCategorias();
    this.listaPessoa();
  }

  getEditando() {
    return Boolean(this.lancamento.codigo);
  }

  listaDeCategorias() {
    this.categoriaaService.listaCategorias()
    .then(response => {
      this.categorias = response.map(c => {
        return {
          label: c.nome,
          value: c.codigo
        };
      });
    })
    .catch(erro => this.errorHandler.handler(erro));
  }

  listaPessoa() {
    this.pessoaService.listar()
      .then(response => {
        this.pessoas = response.content.map(p => {
          return {
            label: p.nome,
            value: p.codigo
          };
        });
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  salvar(form: FormControl) {
    if (this.getEditando()) {
      this.atualizar(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: FormControl) {
    this.lancamentoService.salvar(this.lancamento)
      .then( response => {
        this.lancamento = response;
        this.toasty.success('Lançamento salvo com sucesso!');
        this.router.navigate(['/lancamentos', this.lancamento.codigo]);
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  buscarPorCodigo(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(response => {
        this.lancamento = response;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  atualizar(form: FormControl) {
    this.lancamentoService.atualizar(this.lancamento)
      .then(response => {
        this.lancamento = response;
        this.toasty.success(`Lançamento de código ${this.lancamento.codigo} alterado com sucesso!`);
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);

    this.router.navigate(['lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`);
  }
}
