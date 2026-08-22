package com.trainmate.trainmate.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
public class RailwayApiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${railradar.api.key}")
    private String apiKey;

    public RailwayApiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public JsonNode getTrains(String from, String to, String date) throws Exception {

        String url = UriComponentsBuilder
                .fromUriString(
                        "https://api.railradar.in/v1/trains/between/{from}/{to}")
                .queryParam("date", date)
                .buildAndExpand(from, to)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);

        RequestEntity<Void> request =
                new RequestEntity<>(
                        headers,
                        HttpMethod.GET,
                        URI.create(url)
                );

        ResponseEntity<String> response =
                restTemplate.exchange(request, String.class);

        return objectMapper
                .readTree(response.getBody())
                .path("data")
                .path("trains");
    }
}