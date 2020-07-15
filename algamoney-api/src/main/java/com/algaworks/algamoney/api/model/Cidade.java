package com.algaworks.algamoney.api.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "cidade")
@Data
public class Cidade {
    @Id
    private Long codigo;

    private String nome;

    @ManyToOne
    @JoinColumn(name = "codigo_estado")
    private Estado estado;
}