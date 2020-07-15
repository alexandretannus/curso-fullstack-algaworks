package com.algaworks.algamoney.api.repository.lancamento;

import java.time.LocalDate;
import java.util.List;

import com.algaworks.algamoney.api.dto.LancamentoEstatisitcaCategoria;
import com.algaworks.algamoney.api.dto.LancamentoEstatisitcaDia;
import com.algaworks.algamoney.api.dto.LancamentoEstatisticaPessoa;
import com.algaworks.algamoney.api.model.Lancamento;
import com.algaworks.algamoney.api.repository.filter.LancamentoFilter;
import com.algaworks.algamoney.api.repository.projection.ResumoLancamento;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LancamentoRepositoryQuery {

    public List<LancamentoEstatisticaPessoa> porPessoa(LocalDate inicio, LocalDate fim);
    public List<LancamentoEstatisitcaCategoria> porCategoria(LocalDate mesReferencia);
    public List<LancamentoEstatisitcaDia> porDia(LocalDate mesReferencia);

    public Page<Lancamento> filtrar(LancamentoFilter lancamentoFilter, Pageable pageable);
    public Page<ResumoLancamento> resumir(LancamentoFilter lancamentoFilter, Pageable pageable);

}