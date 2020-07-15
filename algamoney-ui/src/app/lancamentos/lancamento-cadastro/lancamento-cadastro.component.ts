import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastyService } from 'ng2-toasty';
import { LancamentoService } from './../lancamento.service';
import { Lancamento } from './../../core/model';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { CategoriaService } from 'src/app/categorias/categoria.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA'},
    { label: 'Despesa', value: 'DESPESA'},
  ];

  categorias = [];
  pessoas = [];
  // lancamento = new Lancamento();

  formulario: FormGroup;

  br: any;

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private errorHandlerService: ErrorHandlerService,
    private toastyService: ToastyService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.br = this.brConfig();
    this.buscarCategorias();
    this.buscarPessoas();

    this.configurarFormulario();

    this.title.setTitle('Novo lançamento');

    const codigoLancamento = this.route.snapshot.params.codigo;

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
      this.title.setTitle('Editar lançamento');
    }
  }

  get editando(): boolean {
    return Boolean(this.formulario.get('codigo').value);
  }

  carregarLancamento(codigo: number): any {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        this.formulario.patchValue(lancamento);
      })
      .catch(erro => this.errorHandlerService.handleError(erro));
  }

  buscarCategorias(): any {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias.map(cat => {
          return {label: cat.nome, value: cat.codigo};
        });
      })
      .catch(erro => this.errorHandlerService.handleError(erro));
  }

  buscarPessoas(): any {
    return this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.map(pessoa => {
          return {label: pessoa.nome, value: pessoa.codigo};
        });
      })
      .catch(erro => this.errorHandlerService.handleError(erro));
  }

  salvar(): any {
    this.editando ? this.atualizarLancamento() : this.adicionarLancamento();
  }

  atualizarLancamento(): any {
    return this.lancamentoService.atualizar(this.formulario.value)
      .then(lancamento => {
        this.toastyService.success('Lancamento atualizado com sucesso');
        this.formulario.patchValue(lancamento);
        this.router.navigate(['/lancamentos']);
      })
      .catch(erro => this.errorHandlerService.handleError(erro));
  }

  adicionarLancamento(): any {
    return this.lancamentoService.adicionar(this.formulario.value)
      .then(lancamentoAdicionado => {
        this.toastyService.success('Lancamento adicionado com sucesso');
        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
      })
      .catch(erro => this.errorHandlerService.handleError(erro));
  }

  configurarFormulario(): void {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [
        null,
        [Validators.required, Validators.minLength(5)]
      ],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: []
    });
  }

  private brConfig(): any {
    return {
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembto', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sem'
    };
  }

  novo(): any {
    this.formulario.reset(new Lancamento());

    this.router.navigate(['/lancamentos/novo']);
  }
}
