package com.algaworks.algamoney.api.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "estado")
@Data
public class Estado {
    @Id
    private Long codigo;

    private String nome;
}