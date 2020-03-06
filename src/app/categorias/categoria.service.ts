import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  categoriaUrl = 'http://localhost:8080/categorias';
  constructor(private http: HttpClient) { }

  listaCategorias(): Promise<any> {
    let headers = new HttpHeaders();
    headers =  headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.categoriaUrl}`, { headers }).toPromise()
      .then(response => response);
  }
}
