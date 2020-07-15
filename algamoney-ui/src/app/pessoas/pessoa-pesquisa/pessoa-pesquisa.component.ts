import { Title } from '@angular/platform-browser';
import { Component, ViewChild, OnInit } from '@angular/core';

import { ToastyService } from 'ng2-toasty';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';

import { PessoaFiltro, PessoaService } from './../pessoa.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Component({
  selector: 'app-pessoa-pesquisa',
  templateUrl: './pessoa-pesquisa.component.html',
  styleUrls: ['./pessoa-pesquisa.component.css']
})
export class PessoaPesquisaComponent implements OnInit {

  pessoas = [];
  filtro = new PessoaFiltro();
  totalRegistros = 0;
  @ViewChild('tabela') grid;

  constructor(
    private pessoaService: PessoaService,
    private toastyService: ToastyService,
    private confirmationService: ConfirmationService,
    private errorHandlerService: ErrorHandlerService,
    private title: Title
  ) {}

    ngOnInit(): void {

      this.title.setTitle('Pesquisa de pessoas');
    }

  pesquisar(pagina = 0): void {

    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
      .then(resultado => {
        this.pessoas = resultado.pessoas;
        this.totalRegistros = resultado.total;
      });
  }

  confirmarExclusao(pessoa: any): void {

    this.confirmationService.confirm({
      message: 'Deseja mesmo excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }


  excluir(pessoa: any): void {
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        this.grid.first === 0 ? this.pesquisar() : this.grid.first = 0;

        this.toastyService.success('Lançamento excluído com sucesso');
      })
      .catch(erro => this.errorHandlerService.handleError(erro));
  }

  alterarAtivo(pessoa: any): void {
    this.pessoaService.alterarAtivo(pessoa.codigo, !pessoa.ativo)
      .then(() => {
        pessoa.ativo = !pessoa.ativo;
        this.toastyService.success('Status alterado com sucesso');
      })
      .catch(erro => this.errorHandlerService.handleError(erro));


  }

  aoMudarPagina(event: LazyLoadEvent): void {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

}
