import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Pessoa } from '../core/model';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 2;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  pessoasUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.pessoasUrl}/pessoas`, { params }).toPromise()
      .then(response => response);
  }

  listar(): Promise<any> {
    return this.http.get(`${this.pessoasUrl}/pessoas`).toPromise()
      .then(response => response);
  }

  excluir(codigo: number): Promise<any> {
    return this.http.delete(`${this.pessoasUrl}/pessoas/${codigo}`).toPromise()
      .then(() => null);
  }

  salvar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.post(`${this.pessoasUrl}/pessoas`, pessoa).toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, status: boolean): Promise<any> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/pessoas/${codigo}/ativo`, status).toPromise()
      .then(() => null);
  }

  buscarrPorId(codigo: number): Promise<Pessoa> {
    return this.http.get<Pessoa>(`${this.pessoasUrl}/pessoas/${codigo}`).toPromise()
      .then(response => response);
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/pessoas/${pessoa.codigo}`, pessoa).toPromise()
      .then(response => response);
  }
}
