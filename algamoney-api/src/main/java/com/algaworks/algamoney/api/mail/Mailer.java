package com.algaworks.algamoney.api.mail;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import com.algaworks.algamoney.api.model.Lancamento;
import com.algaworks.algamoney.api.model.Usuario;
import com.algaworks.algamoney.api.repository.LancamentoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Component
public class Mailer {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine tEngine;

    @Autowired
    private LancamentoRepository lancamentoRepository;
    /*
     * @EventListener public void teste(ApplicationReadyEvent event) { String
     * remetente = "amtannus.teste.software@gmail.com"; List<String> destinatarios =
     * Arrays.asList("alexandretannus@gmail.com"); String assunto =
     * "Teste de envio de email"; String mensagem =
     * "Teste de envio de email com JAVA. <br><br> Funciona";
     * 
     * enviarEmail(remetente, destinatarios, assunto, mensagem);
     * System.out.println("\n\nEmail enviado com sucesso\n\n"); }
     */
    /*
     * @EventListener public void teste(ApplicationReadyEvent event) { String
     * template = "mail/aviso-lancamentos-vencidos";
     * 
     * List<Lancamento> lista = lancamentoRepository.findAll();
     * 
     * Map<String, Object> variaveis = new HashMap<>(); variaveis.put("lancamentos",
     * lista);
     * 
     * String remetente = "amtannus.teste.software@gmail.com"; List<String>
     * destinatarios = Arrays.asList("alexandretannus@gmail.com"); String assunto =
     * "Teste de envio de email";
     * 
     * enviarEmail(remetente, destinatarios, assunto, template, variaveis);
     * System.out.println("\n\nEmail enviado com sucesso\n\n"); }
     */

    public void avisarSobreLancamentosVencidos(List<Lancamento> vencidos, List<Usuario> destinatarios) {
        
        Map<String, Object> variaveis = new HashMap<>();        
        variaveis.put("lancamentos", vencidos);

        
/*         List<String> emails = destinatarios.stream()
            .map(usuario -> usuario.getEmail())
            .collect(Collectors.toList()); */
        
        List<String> emails = Arrays.asList("alexandretannus@gmail.com");
        String template = "mail/aviso-lancamentos-vencidos";
        String remetente = "amtannus.teste.software@gmail.com";
        String assunto = "Lançamentos vencidos";



        enviarEmail(remetente, emails, assunto, template, variaveis);
    }

    public void enviarEmail(String remetente, List<String> destinatarios, String assunto, String template,
            Map<String, Object> variaveis) {

        Context context = new Context(new Locale("pt", "BR"));

        variaveis.entrySet().forEach(e -> context.setVariable(e.getKey(), e.getValue()));

        String mensagem = tEngine.process(template, context);
        enviarEmail(remetente, destinatarios, assunto, mensagem);
    }

    public void enviarEmail(String remetente, List<String> destinatarios, String assunto, String mensagem) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
        try {
            helper.setFrom(remetente);
            helper.setTo(destinatarios.toArray(new String[destinatarios.size()]));
            helper.setSubject(assunto);
            helper.setText(mensagem, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Problemas com o envio de email", e);
        }

    }
}