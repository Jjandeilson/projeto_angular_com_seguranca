import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl = 'http://localhost:8080/oauth/token';
  tokensRevoke = 'http://localhost:8080/tokens/revoke';
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelpeService: JwtHelperService
  ) {
    this.carregarToken();
   }

  login(usuario: string, senha: string): Promise<void> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bGFyMA==');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers }).toPromise()
      .then(response => {
        this.armazenarToken(response);
      })
      .catch(erro => {
        if (erro.status === 400) {
          if (erro.error.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida');
          }
        }
        return Promise.reject(erro);
      });
  }

  obterNovoAccessToken(): Promise<void> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bGFyMA==');

    const body = 'grant_type=refresh_token';
    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true }).toPromise()
      .then(response => {
        this.armazenarToken(response);
        console.log('Novo access token criado');
        return Promise.resolve(null);
      })
      .catch(response => {
        console.log('Erro ao renovar token', response);
        return Promise.resolve(null);
      });
  }

  limpaAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelpeService.isTokenExpired(token);
  }

  temPermisao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermisao(role)) {
        return true;
      }
    }
    return false;
  }

  private armazenarToken(token: any) {
    this.jwtPayload = this.jwtHelpeService.decodeToken(token.access_token);
    localStorage.setItem('token', token.access_token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

  logout() {
    return this.http.delete(this.tokensRevoke, { withCredentials: true }).toPromise()
      .then(() => {
        this.limpaAccessToken();
      });
  }

}
