package com.trainmate.trainmate.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;

@Service
public class TrainService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${railradar.api.key}")
    private String apiKey;

    public TrainService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public JsonNode searchTrains(String from, String to) throws Exception {

        String url = "https://api.railradar.in/v1/trains/between/"
                + from.toUpperCase()
                + "/"
                + to.toUpperCase();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);

        RequestEntity<Void> request = new RequestEntity<>(
                headers,
                HttpMethod.GET,
                URI.create(url)
        );

        ResponseEntity<String> response =
                restTemplate.exchange(request, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());

        // RailRadar returns:
        // { success: true, data: { trains: [...] } }

        return root.path("data").path("trains");
    }
}