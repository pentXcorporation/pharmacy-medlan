package com.pharmacy.medlan.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // allow all endpoints
                        .allowedOrigins("https://medlan.vercel.app") // allow your frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // allow common methods
                        .allowedHeaders("*")
                        .allowCredentials(true); // allow cookies/auth headers
            }
        };
    }
}
