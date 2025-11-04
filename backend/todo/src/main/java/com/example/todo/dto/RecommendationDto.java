package com.example.todo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RecommendationDto {

    @JsonProperty("employeeId")
    private String employeeId; // Changed to String to be consistent

    @JsonProperty("score")
    private double score;

    // --- Default constructor (good practice for frameworks like Jackson) ---
    public RecommendationDto() {
    }
    
    // --- Getters and Setters ---
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}