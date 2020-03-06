import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import * as moment from 'moment';
import { Lancamento } from '../core/model';

export class LancamentoFilter {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient) { }

  pesquisar(filter: LancamentoFilter): Promise<any> {
    let params = new HttpParams();

    params = params.set('page', filter.pagina.toString());
    params = params.set('size', filter.itensPorPagina.toString());

    if (filter.descricao) {
       params = params.set('descricao', filter.descricao);
     }

    if (filter.dataVencimentoInicio) {
       params = params.set('dataVencimentoDe', moment(filter.dataVencimentoInicio).format('YYYY-MM-DD'));
     }
    if (filter.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', moment(filter.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    return this.http.get(`${this.lancamentosUrl}?resumo`, { params }).toPromise()
        .then(response => response);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.lancamentosUrl}/${codigo}`).toPromise()
      .then(() => null);
  }

  salvar(lancamento: Lancamento): Promise<Lancamento> {
    return this.http.post<Lancamento>(`${this.lancamentosUrl}`, lancamento).toPromise()
      .then(response => response);
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento).toPromise()
      .then(response => response);
  }

  buscarPorCodigo(codigo: number): Promise<any> {
    return this.http.get(`${this.lancamentosUrl}/${codigo}`).toPromise()
      .then((response) => {
        this.converteStringParaData(response);
        return response;
      });
  }

  private converteStringParaData(lancamento: any) {
    if (lancamento.dataPagamento != null) {
      lancamento.dataPagamento = moment(lancamento.dataPagamento, 'YYYY-MM-DD').toDate();
    }
    if (lancamento.dataVencimento != null) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento, 'YYYY-MM-DD').toDate();
    }
  }
}
