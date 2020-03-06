import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/seguranca/auth.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../error-handler.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  exibindoMenu = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private erroHandler: ErrorHandlerService
  ) { }

  ngOnInit() {

  }

  criarNovoAccessToken() {
    this.auth.obterNovoAccessToken();
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(erro => this.erroHandler.handler(erro));
  }

}
