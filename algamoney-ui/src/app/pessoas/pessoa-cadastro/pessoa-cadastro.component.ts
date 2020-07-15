import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { ToastyService } from 'ng2-toasty';
import { Component, OnInit } from '@angular/core';
import { PessoaService } from '../pessoa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pessoa, Contato } from 'src/app/core/model';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();

  estados: any[];
  cidades: any[];
  estadoSelecionado: number;

  exibindoFormularioContato = false;

  contato: Contato;
  contatoIndex: number;

  constructor(
    private pessoaService: PessoaService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    const codigoPessoa = this.route.snapshot.params.codigo;

    this.title.setTitle('Nova pessoa');
    this.carregarEstados();

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }
  }

  get editando(): boolean {
    return Boolean(this.pessoa.codigo)
  }

  carregarPessoa(codigo: number): void {
    this.pessoaService.buscarPorCodigo(codigo)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.estadoSelecionado = this.pessoa.endereco.cidade ? this.pessoa.endereco.cidade.estado.codigo : null;

        if (this.estadoSelecionado) {
          this.carregarCidades();
        }

        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handleError(erro));
  }

  salvar(form: FormControl): void {
    if (this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: FormControl): void {
    this.pessoaService.adicionar(this.pessoa)
      .then(pessoaAdicionada => {
        this.toasty.success('Pessoa adicionada com sucesso!');
        this.router.navigate(['/pessoas', pessoaAdicionada.codigo]);
      })
      .catch(erro => this.errorHandler.handleError(erro));
  }

  atualizarPessoa(form: FormControl): void {
    this.pessoaService.atualizar(this.pessoa)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.toasty.success('Pessoa alterada com sucesso!');
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handleError(erro));
  }

  nova(form: FormControl): void {
    form.reset();

    setTimeout(() => this.pessoa = new Pessoa(), 1);

    this.router.navigate(['/pessoas/nova']);
  }

  atualizarTituloEdicao(): void {
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }

  carregarEstados(): void {
    this.pessoaService.listarEstados()
      .then(lista => {
        this.estados = lista.map(estado => ({label: estado.nome, value: estado.codigo}))
      })
      .catch(erro => this.errorHandler.handleError(erro))
  }

  carregarCidades(): void {
    this.pessoaService.pesquisarCidades(this.estadoSelecionado)
      .then(lista => {
        this.cidades = lista.map(cidade => ({label: cidade.nome, value: cidade.codigo}));
      })
      .catch(erro => this.errorHandler.handleError(erro));
  }

  prepararNovoContato(): void {
    this.exibindoFormularioContato = true;

    this.contato = new Contato();
    this.contatoIndex = this.pessoa.contatos.length;
  }

  confirmarContato(form: FormControl): void {
    this.pessoa.contatos[this.contatoIndex] = this.clonarContato(this.contato);
    this.exibindoFormularioContato = false;
    form.reset();
  }

  clonarContato(contato: Contato): Contato {
    return new Contato(contato.codigo, contato.nome, contato.email, contato.telefone);
  }

  prepararEdicaoContato(contato: Contato, index: number): void {
    this.contato = this.clonarContato(contato);
    this.exibindoFormularioContato = true;
    this.contatoIndex = index;
  }

  excluirContato(index: number): void {
    this.pessoa.contatos.splice(index, 1);
  }

}
