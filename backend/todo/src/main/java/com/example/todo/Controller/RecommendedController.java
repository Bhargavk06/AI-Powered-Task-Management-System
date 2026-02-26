package com.example.todo.Controller;

import com.example.todo.AssignedTask;
import com.example.todo.UserAuthentication;
import com.example.todo.Repository.AssignedTaskRepository;
import com.example.todo.Repository.UserRepository;
import com.example.todo.dto.EmployeeHistoryDto;
import com.example.todo.dto.PythonRequestDto;
import com.example.todo.dto.RecommendationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class RecommendedController {

    @Autowired
    private AssignedTaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/recommend")
    public ResponseEntity<RecommendationDto[]> getRecommendation(@RequestBody String taskDescription) {
        
        List<UserAuthentication> allEmployees = userRepository.findAll();

        List<EmployeeHistoryDto> employeeHistories = allEmployees.stream().map(employee -> {
            
            List<AssignedTask> tasks = taskRepository.findByAssignee(employee);
            
            String concatenatedDescriptions = tasks.stream()
                    .map(AssignedTask::getDescription)
                    .collect(Collectors.joining(". "));

     
            return new EmployeeHistoryDto(employee.getId(), concatenatedDescriptions);
            
        }).collect(Collectors.toList());

        PythonRequestDto pythonRequest = new PythonRequestDto(taskDescription, employeeHistories);

        RestTemplate restTemplate = new RestTemplate();
        String pythonUrl = "http://127.0.0.1:5000/recommend";

        RecommendationDto[] recommendations = restTemplate.postForObject(pythonUrl, pythonRequest, RecommendationDto[].class);

        return ResponseEntity.ok(recommendations);
    }
    
    @GetMapping("/training-data")
    public List<Map<String, Object>> getTrainingData() {
        return taskRepository.findAll().stream()
                .filter(task -> task.getAssignee() != null && task.getDescription() != null)
                .map(task -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    // No parsing needed here either.
                    map.put("employeeId", task.getAssignee().getId());
                    map.put("taskDescription", task.getDescription());
                    return map;
                })
                .collect(Collectors.toList());
    }
}