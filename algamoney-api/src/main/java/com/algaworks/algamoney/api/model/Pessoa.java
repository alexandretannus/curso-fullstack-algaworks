package com.algaworks.algamoney.api.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Entity
@Table(name = "pessoa")
@Data
public class Pessoa {

	@Id
	@GeneratedValue( strategy = GenerationType.IDENTITY)
	private Long codigo;
	
	@NotNull
	@Size(min=3, max = 30)
    private String nome;
    
    @Embedded
    private Endereco endereco;

    @NotNull
    private Boolean ativo;
    
    @JsonIgnoreProperties("pessoa")
    @Valid
    @OneToMany(mappedBy = "pessoa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contato> contatos;
}