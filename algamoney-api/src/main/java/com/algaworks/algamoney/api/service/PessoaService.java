package com.algaworks.algamoney.api.service;

import java.util.Optional;

import com.algaworks.algamoney.api.model.Pessoa;
import com.algaworks.algamoney.api.repository.PessoaRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

@Service
public class PessoaService {
    @Autowired
    private PessoaRepository pessoaRepository;

    public Pessoa salvar(Pessoa pessoa) {

        pessoa.getContatos().forEach(contato -> contato.setPessoa(pessoa));

		return pessoaRepository.save(pessoa);

    }

    public Pessoa atualizar(Long codigo, Pessoa pessoa) {
        Pessoa pessoaSalva = buscarPessoaPeloCodigo(codigo);

        pessoaSalva.getContatos().clear();
        pessoaSalva.getContatos().addAll(pessoa.getContatos());

        pessoaSalva.getContatos().forEach(contato -> contato.setPessoa(pessoaSalva));

		BeanUtils.copyProperties(pessoa, pessoaSalva, "codigo", "contatos");

		return pessoaRepository.save(pessoaSalva);
    }

	public Pessoa atualizarPropriedadeAtivo(Long codigo, Boolean ativo) {
        Pessoa pessoaSalva = buscarPessoaPeloCodigo(codigo);

        pessoaSalva.setAtivo(ativo);

        return pessoaRepository.save(pessoaSalva);	
    }
    
    public Pessoa buscarPessoaPeloCodigo(Long codigo) {
        Optional<Pessoa> pessoaSalva = pessoaRepository.findById(codigo);

		if (!pessoaSalva.isPresent()) {
			throw new EmptyResultDataAccessException(1);
		}
        return pessoaSalva.get();
    }
}