package com.trainmate.trainmate.controller;

import com.trainmate.trainmate.service.TrainService;
import org.springframework.web.bind.annotation.*;

import tools.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/trains")
@CrossOrigin(origins = "http://localhost:5173")
public class TrainController {

    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping("/search")
    public JsonNode searchTrains(
            @RequestParam String from,
            @RequestParam String to
    ) throws Exception {

        return trainService.searchTrains(from, to);
    }
}