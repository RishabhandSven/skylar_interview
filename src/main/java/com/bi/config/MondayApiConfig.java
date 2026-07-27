package com.bi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.codec.support.DefaultClientCodecConfigurer;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class MondayApiConfig {

    @Value("${monday.api.base-url:https://api.monday.com/v2}")
    private String baseUrl;

    @Bean
    public WebClient mondayWebClient(WebClient.Builder webClientBuilder) {
        String apiToken = System.getenv("MONDAY_API_TOKEN");

        if (apiToken == null) {
            apiToken = "";
        }

        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(10));

        ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
                .codecs(configurer ->
                        configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();

        return webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, apiToken)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("API-Version", "2023-10")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(exchangeStrategies)
                .build();
    }
}
