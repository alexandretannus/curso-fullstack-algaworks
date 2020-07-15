import { environment } from './../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl: string;
  tokenRevokeUrl: string;

  jwtPayload: any;

  constructor(
    public http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {

    this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
    this.tokenRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
    this.carregarToken();
  }


  login(usuario: string, senha: string): Promise<void> {
    const headers = this.setHeaders();

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(response[`access_token`]);
      })
      .catch(response => {
        const responseError = response.error;
        if (response.status === 400) {
          if (responseError.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida');
          }
        }
        return Promise.reject(response);
      });
  }

  logout(): Promise<void> {
    return this.http.delete(this.tokenRevokeUrl, { withCredentials: true})
      .toPromise()
      .then(() => {
        this.limparAccessToken();
      });
  }

  temPermissao(permissao: string): boolean {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  obterNovoAccessToken(): Promise<void> {
    const headers = this.setHeaders();

    const body = `grant_type=refresh_token`;

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(response[`access_token`]);
        return Promise.resolve(null);
      })
      .catch(response => {
        console.error('Erro ao renovar token. ', response);
        return Promise.resolve(null);
      });
  }

  isAccessTokenInvalido(): boolean {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  temQualquerPermissao(roles): boolean {

    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  limparAccessToken(): void {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  private armazenarToken(token: string): void {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

  private setHeaders(): HttpHeaders {
    return new HttpHeaders()
                  .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEBy')
                  .append('Content-Type', 'application/x-www-form-urlencoded');
  }
}
