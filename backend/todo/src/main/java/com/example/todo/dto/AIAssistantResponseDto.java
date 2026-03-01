package com.example.todo.dto;

import java.util.List;

public record AIAssistantResponseDto(
    String type, 
    List<AiTaskRecommendation> tasks
) {}

record AiTaskRecommendation(
    String taskName,
    String description,
    String deadline,
    String priority,
    String status,
    String reasoning
) {}