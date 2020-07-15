package com.algaworks.algamoney.api.security;

import java.util.Collection;

import com.algaworks.algamoney.api.model.Usuario;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;

public class UsuarioSistema extends User {

    private static final long serialVersionUID = 1L;

    @Getter
    private Usuario usuario;

    public UsuarioSistema(Usuario usuario, Collection<? extends GrantedAuthority> authorities) {
        super(usuario.getEmail(), usuario.getSenha(), authorities);
        this.usuario = usuario;
    }
}