import { AuthService } from 'src/app/seguranca/auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastyService } from 'ng2-toasty';
import { LazyLoadEvent, ConfirmationService } from 'primeng/api';

import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  filtro = new LancamentoFiltro();
  totalRegistros = 0;
  lancamentos = [];
  @ViewChild('tabela') grid;

  lancamentosCols = [
    { field: 'pessoa', header: 'Pessoa'},
    { field: 'descricao', header: 'Descrição'},
    { field: 'dataVencimento', header: 'Vencimento'},
    { field: 'dataPagamento', header: 'Pagamento'},
    { field: 'valor', header: 'Valor'},
  ];

  constructor(
    public auth: AuthService,
    private lancamentoService: LancamentoService,
    private toastyService: ToastyService,
    private confirmationService: ConfirmationService,
    private errorHandlerService: ErrorHandlerService,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Pesquisa de lançamentos');
  }

  pesquisar(pagina = 0): void {

    this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.lancamentos = resultado.lancamentos;
        this.totalRegistros = resultado.total;
      })
      .catch(erro => this.errorHandlerService.handleError(erro));
  }

  confirmarExclusao(lancamento: any): void {

    this.confirmationService.confirm({
      message: 'Deseja mesmo excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }


  excluir(lancamento: any): void {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        this.grid.first === 0 ? this.pesquisar() : this.grid.first = 0;

        this.toastyService.success('Lançamento excluído com sucesso');
      })
      .catch(erro => this.errorHandlerService.handleError(erro));
  }

  aoMudarPagina(event: LazyLoadEvent): void {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

}
