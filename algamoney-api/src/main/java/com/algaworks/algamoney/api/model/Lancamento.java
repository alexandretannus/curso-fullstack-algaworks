package com.algaworks.algamoney.api.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Entity
@Table(name = "lancamento")
@Data
public class Lancamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @NotNull
    private String descricao;
    
    @Column(name="data_vencimento")
    @NotNull
    private LocalDate dataVencimento;
    
    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;
    
    @NotNull
    private BigDecimal valor;
    
    private String observacao;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    private TipoLancamento tipo;
    
    @NotNull
    @ManyToOne
    @JoinColumn(name = "codigo_categoria")
    private Categoria categoria;
    
    @NotNull
    @ManyToOne
    @JoinColumn(name = "codigo_pessoa")
    @JsonIgnoreProperties("contatos")
    private Pessoa pessoa;
    
    @JsonIgnore
    public boolean isReceita() {
        return TipoLancamento.RECEITA.equals(this.tipo);
    }

}