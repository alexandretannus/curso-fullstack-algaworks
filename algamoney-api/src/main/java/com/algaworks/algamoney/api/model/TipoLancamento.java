package com.algaworks.algamoney.api.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public enum TipoLancamento {
    RECEITA("Receita"),
    DESPESA("Despesa");

    @Getter
    private final String descricao;
}
