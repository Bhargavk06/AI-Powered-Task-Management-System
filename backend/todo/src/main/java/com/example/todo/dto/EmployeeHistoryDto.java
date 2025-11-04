package com.example.todo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EmployeeHistoryDto {

    @JsonProperty("employeeId")
    private String employeeId;

    @JsonProperty("pastTaskDescriptions")
    private String pastTaskDescriptions;

    // --- ADD THIS CONSTRUCTOR ---
    public EmployeeHistoryDto(String employeeId, String pastTaskDescriptions) {
        this.employeeId = employeeId;
        this.pastTaskDescriptions = pastTaskDescriptions;
    }

    // --- Getters and Setters (yours were already correct) ---
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getPastTaskDescriptions() {
        return pastTaskDescriptions;
    }

    public void setPastTaskDescriptions(String pastTaskDescriptions) {
        this.pastTaskDescriptions = pastTaskDescriptions;
    }
}