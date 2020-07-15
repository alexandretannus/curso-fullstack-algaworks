import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa, Estado, Cidade } from '../core/model';


export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  pessoasUrl: string;
  cidadesUrl: string;
  estadosUrl: string;

  constructor(private http: HttpClient) {

    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
    this.cidadesUrl = `${environment.apiUrl}/cidades`;
    this.estadosUrl = `${environment.apiUrl}/estados`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {

    const headers = this.setHeaders();
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());


    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.pessoasUrl}`, { headers, params })
      .toPromise()
      .then(response => {
        const resultado = {
          pessoas: response[`content`],
          total: response[`totalElements`],
        };
        return resultado;
      });
  }

  listarTodas(): Promise<any> {

    const headers = this.setHeaders();

    return this.http.get(this.pessoasUrl, { headers })
      .toPromise()
      .then(response =>  response[`content`]);
  }

  excluir(codigo: number): Promise<void> {

    const headers = this.setHeaders();

    return this.http.delete(`${this.pessoasUrl}/${codigo}`, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    let headers = this.setHeaders();
    headers = headers.append('Content-Type', 'application/json');

    return this.http.post<Pessoa>(this.pessoasUrl, pessoa, { headers })
      .toPromise()
      .then(response => response);
  }

  alterarAtivo(codigo: number, ativo: boolean): Promise<void> {
    let headers = this.setHeaders();
    headers = headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers})
    .toPromise()
    .then(() => null);
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    let headers = this.setHeaders();
    headers = headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa, { headers })
      .toPromise()
      .then(response => {
        const pessoaAlterado = response as Pessoa;

        return pessoaAlterado;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    const headers = this.setHeaders();

    return this.http.get(`${this.pessoasUrl}/${codigo}`, { headers })
      .toPromise()
      .then(response => {
        const pessoa = response as Pessoa;

        return pessoa;
      });
  }

  pesquisarCidades(estado): Promise<Cidade[]> {
    let params = new HttpParams();
    params = params.set('estado', estado);
    return this.http.get(this.cidadesUrl, { params})
        .toPromise()
        .then(response => response as Cidade[]);
  }

  listarEstados(): Promise<Estado[]> {
    return this.http.get(this.estadosUrl)
        .toPromise()
        .then(response => response as Estado[]);
  }

  setHeaders(): HttpHeaders {
    return new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
  }
}
