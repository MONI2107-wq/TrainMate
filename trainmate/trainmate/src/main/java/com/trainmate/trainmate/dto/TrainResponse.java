package com.trainmate.trainmate.dto;

public class TrainResponse {

    private String trainNumber;
    private String trainName;
    private String trainType;
    private String departure;
    private String arrival;
    private int duration;
    private double distance;
    private int halts;

    public TrainResponse() {
    }

    public TrainResponse(
            String trainNumber,
            String trainName,
            String trainType,
            String departure,
            String arrival,
            int duration,
            double distance,
            int halts) {

        this.trainNumber = trainNumber;
        this.trainName = trainName;
        this.trainType = trainType;
        this.departure = departure;
        this.arrival = arrival;
        this.duration = duration;
        this.distance = distance;
        this.halts = halts;
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public String getTrainName() {
        return trainName;
    }

    public String getTrainType() {
        return trainType;
    }

    public String getDeparture() {
        return departure;
    }

    public String getArrival() {
        return arrival;
    }

    public int getDuration() {
        return duration;
    }

    public double getDistance() {
        return distance;
    }

    public int getHalts() {
        return halts;
    }
}