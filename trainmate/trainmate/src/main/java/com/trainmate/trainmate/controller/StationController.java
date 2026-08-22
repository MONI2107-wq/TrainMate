package com.trainmate.trainmate.controller;

import com.trainmate.trainmate.service.StationService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = "http://localhost:5173")
public class StationController {

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping("/search")
    public JsonNode searchStations(
            @RequestParam("query") String query
    ) throws Exception {

        return stationService.searchStations(query);
    }
}