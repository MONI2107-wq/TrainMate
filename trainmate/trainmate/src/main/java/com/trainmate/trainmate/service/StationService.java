package com.trainmate.trainmate.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;

@Service
public class StationService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${railradar.api.key}")
    private String apiKey;

    public StationService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public JsonNode searchStations(String query) throws Exception {

        String url = UriComponentsBuilder
                .fromUriString("https://api.railradar.in/v1/lookup/search/stations")
                .queryParam("q", query)
                .queryParam("limit", 20)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);

        RequestEntity<Void> request = new RequestEntity<>(
                headers,
                HttpMethod.GET,
                URI.create(url)
        );

        ResponseEntity<String> response =
                restTemplate.exchange(request, String.class);

        return objectMapper.readTree(response.getBody());
    }
}