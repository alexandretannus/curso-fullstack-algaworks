import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  categoriasUrl: string;
  categorias = [];

  constructor(
    private http: HttpClient
  ) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }

  listarTodas(): Promise<any> {

    const headers = this.setHeaders();

    return this.http.get(`${this.categoriasUrl}`, { headers })
      .toPromise()
      .then(response => response );
  }

  setHeaders(): HttpHeaders {
    return new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
  }
}
