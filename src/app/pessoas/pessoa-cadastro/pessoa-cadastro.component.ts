import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PessoaService } from '../pessoa.service';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { FormControl, Form } from '@angular/forms';
import { Pessoa } from 'src/app/core/model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();

  constructor(
    private pessoaService: PessoaService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    const codigo = this.route.snapshot.params[('codigo')];
    this.title.setTitle('Nova pessoa');

    if (codigo) {
      this.buscar(codigo);
    }
    this.getEditar();
  }
  getEditar() {
    return Boolean (this.pessoa.codigo);
  }

  salvar(form: FormControl) {
    if (this.getEditar()) {
      this.atualizar(form);
    } else {
      this.adiconarPessoa(form);
    }
  }

  adiconarPessoa(form: FormControl) {
    this.pessoaService.salvar(this.pessoa)
      .then(() => {
        this.toasty.success('Pessoa salva com sucesso!');
        form.reset();
        this.pessoa = new Pessoa();
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  buscar(codigo: number) {
    this.pessoaService.buscarrPorId(codigo)
      .then(response => {
        this.pessoa = response;
        this.atualizarEdicao();
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  atualizar(form: FormControl) {
    this.pessoaService.atualizar(this.pessoa)
      .then(response => {
        this.pessoa = response;
        this.toasty.success(`Pessoa com códgio: ${this.pessoa.codigo} atualizado com sucesso!`);
        this.atualizarEdicao();
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.pessoa = new Pessoa();
    }.bind(this), 1);

    this.router.navigate(['/pessoas/novo']);
  }

  atualizarEdicao() {
    this.title.setTitle(`Editatando a pessoa: ${this.pessoa.nome}`);
  }
}
