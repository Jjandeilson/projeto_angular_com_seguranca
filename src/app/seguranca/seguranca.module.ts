import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginFormComponent } from './login-form/login-form.component';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    LoginFormComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,

    InputTextModule,
    ButtonModule,
    SegurancaRoutingModule,

    JwtModule.forRoot({
     config: {
       whitelistedDomains: ['localhost:8080'],
       tokenGetter: () => {
         return localStorage.getItem('token');
       }
     }
    })
  ],
  providers: [
    JwtHelperService
  ]
})
export class SegurancaModule { }
