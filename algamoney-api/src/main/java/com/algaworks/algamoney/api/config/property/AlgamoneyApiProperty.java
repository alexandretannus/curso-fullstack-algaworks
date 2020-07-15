package com.algaworks.algamoney.api.config.property;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties("algamoney")
public class AlgamoneyApiProperty {

    @Getter @Setter
    private String origemPermitida = "http://localhost:4200";

    @Getter
    private final Seguranca seguranca = new Seguranca();

    @Getter
    public final Mail mail = new Mail();
    
    public static class Seguranca {
        @Getter @Setter
        private boolean enableHttps;
    }

    
    public static class Mail {

        @Getter @Setter
        private String host;

        @Getter @Setter
        private Integer port;

        @Getter @Setter
        private String username;
        
        @Getter @Setter
        private String password;
    }

}