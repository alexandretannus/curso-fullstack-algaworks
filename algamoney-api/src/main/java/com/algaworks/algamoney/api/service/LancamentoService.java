package com.algaworks.algamoney.api.service;

import java.io.InputStream;
import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import com.algaworks.algamoney.api.dto.LancamentoEstatisticaPessoa;
import com.algaworks.algamoney.api.mail.Mailer;
import com.algaworks.algamoney.api.model.Lancamento;
import com.algaworks.algamoney.api.model.Pessoa;
import com.algaworks.algamoney.api.model.Usuario;
import com.algaworks.algamoney.api.repository.LancamentoRepository;
import com.algaworks.algamoney.api.repository.PessoaRepository;
import com.algaworks.algamoney.api.repository.UsuarioRepository;
import com.algaworks.algamoney.api.service.exception.PessoaInexistenteouInativaException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@Service
public class LancamentoService {

    private static final String DESTINATARIOS = "ROLE_PESQUISAR_LANCAMENTO";

    private static final Logger logger = LoggerFactory.getLogger(LancamentoService.class);

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private LancamentoRepository lancamentoRepository;

    @Autowired
    private Mailer mailer;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Lancamento salvar(Lancamento lancamento) {

        validarPessoa(lancamento);

        return lancamentoRepository.save(lancamento);
    }

    public Lancamento atualizar(Long codigo, Lancamento lancamento) {
		Lancamento lancamentoSalvo = buscarLancamentoExistente(codigo);
		if (!lancamento.getPessoa().equals(lancamentoSalvo.getPessoa())) {
			validarPessoa(lancamento);
		}

		BeanUtils.copyProperties(lancamento, lancamentoSalvo, "codigo");

		return lancamentoRepository.save(lancamentoSalvo);
	}

	private void validarPessoa(Lancamento lancamento) {
		Pessoa pessoa = null;
		if (lancamento.getPessoa().getCodigo() != null) {
			pessoa = pessoaRepository.getOne(lancamento.getPessoa().getCodigo());
		}

		if (pessoa == null || !pessoa.getAtivo()) {
			throw new PessoaInexistenteouInativaException();
		}
    }
    
    
	private Lancamento buscarLancamentoExistente(Long codigo) {
		Optional<Lancamento> lancamentoSalvo = lancamentoRepository.findById(codigo);
		if (!lancamentoSalvo.isPresent()) {
			throw new IllegalArgumentException();
		}
		return lancamentoSalvo.get();
	}



    public byte[] relatorioPorPessoa(LocalDate inicio, LocalDate fim) throws Exception {
        List<LancamentoEstatisticaPessoa> dados = lancamentoRepository.porPessoa(inicio, fim);

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("DT_INICIO", Date.valueOf(inicio));
        parametros.put("DT_FIM", Date.valueOf(fim));
        parametros.put("REPORT_LOCALE", new Locale("pt", "BR"));

        InputStream inputStream = this.getClass().getResourceAsStream(
            "/relatorios/lancamentos-por-pessoa.jasper"
        );

        JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parametros, 
            new JRBeanCollectionDataSource(dados));

        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    @Scheduled(cron="0 0 6 * * *")
    public void avisarSobreLancamentosVencidos() {

        if (logger.isDebugEnabled()) {
            logger.debug("Preparando envio de e-mails");
        }

        List<Lancamento> lancamentosVencidos = lancamentoRepository.
            findByDataVencimentoLessThanEqualAndDataPagamentoIsNull(LocalDate.now());

        if (lancamentosVencidos.isEmpty()) {
            logger.info("Sem lançamentos vencidos");
            return;
        }

        logger.info("Existem {} lançamentos vencidos", lancamentosVencidos.size());

        List<Usuario> destinatarios = usuarioRepository
            .findByPermissoesDescricao(DESTINATARIOS);

        if (destinatarios.isEmpty()) {
            logger.warn("Sem destinatários");
        }

        mailer.avisarSobreLancamentosVencidos(lancamentosVencidos, destinatarios);

        logger.info("Envio de e-mail concluído");
    }


}