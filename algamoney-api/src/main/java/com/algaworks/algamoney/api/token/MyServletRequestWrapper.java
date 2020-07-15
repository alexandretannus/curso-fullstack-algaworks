package com.algaworks.algamoney.api.token;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.catalina.util.ParameterMap;

import lombok.Getter;

public class MyServletRequestWrapper extends HttpServletRequestWrapper {

    @Getter
    private String refreshToken;

    public MyServletRequestWrapper(final HttpServletRequest request, String refreshToken) {
        super(request);

        this.refreshToken = refreshToken;
    }

    @Override
    public Map<String, String[]> getParameterMap() {
        
        ParameterMap<String, String[]> map = new ParameterMap<>(getRequest().getParameterMap());
        map.put("refresh_token", new String[] { refreshToken });
        map.setLocked(true);
        return map;
    }

}