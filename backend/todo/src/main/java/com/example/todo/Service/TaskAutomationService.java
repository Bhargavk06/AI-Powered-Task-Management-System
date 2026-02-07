package com.example.todo.Service;

import com.example.todo.AssignedTask;
import com.example.todo.UnassignedTask;
import com.example.todo.UserAuthentication;
import com.example.todo.Repository.UnassignedTaskRepository;
import com.example.todo.Repository.UserRepository;
import com.example.todo.dto.AutomationDto;
import com.example.todo.dto.AutomationDto.*;
import com.example.todo.dto.RecommendationDto;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TaskAutomationService {

    private final ChatClient chatClient;

    @Autowired
    private SkillMatchService skillMatchService;

    @Autowired
    private AssignedTaskService assignedTaskService;

    @Autowired
    private UnassignedTaskRepository unassignedRepo;

    @Autowired
    private UserRepository userRepository;

    public UnassignedTask addToQueue(TaskDraft draft, String adminId) {
        UserAuthentication admin = userRepository.findById(adminId).get();
        UnassignedTask task = new UnassignedTask();
        task.setTaskname(draft.taskName());
        task.setDescription(draft.description());
        task.setPriority(draft.priority());
        task.setDeadline(draft.deadline());
        task.setCreatedBy(admin);
        return unassignedRepo.save(task);
    }

    public List<UnassignedTask> getQueue(String adminId) {
        return unassignedRepo.findByCreatedById(adminId);
    }

    public void removeFromQueue(Long id) {
        unassignedRepo.deleteById(id);
    }

     public void finalizeAndSave(AutomationDto.FinalAssignRequest request, String adminId) {
        // 1. We create the FinalAssignRequest for the main service
        // Make sure the DTO includes 'assignedById'
        AutomationDto.FinalAssignRequest secureRequest = new AutomationDto.FinalAssignRequest(
            request.tempId(),
            request.taskName(),
            request.description(),
            request.priority(),
            request.deadline(),
            request.assignedToId(),
            adminId // Securely injected
        );

        // 2. Call your main AssignedTaskService to save to the main table
        assignedTaskService.assignAutomatedTask(secureRequest);
        
        // 3. Delete from the "Waiting Room" (UnassignedTask)
        if(request.tempId() != null) {
            unassignedRepo.deleteById(Long.parseLong(request.tempId()));
        }
    }   

    public TaskAutomationService(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultSystem("You are a Task Allocation Specialist. Justify why an employee is a good fit...")
                .build();
    }

    public AutomationResponse generateBulkSuggestions(List<TaskDraft> tasks) {
        Map<String, List<Recommendation>> suggestionsMap = new HashMap<>();
        for (TaskDraft draft : tasks) {
            RecommendationDto[] pythonMatches = skillMatchService.getSkillMatches(draft.description());
            List<Recommendation> enhancedList = new ArrayList<>();
            if (pythonMatches != null) {
                Arrays.stream(pythonMatches).limit(3).forEach(match -> {
                    List<AssignedTask> activeTasks = assignedTaskService.getActiveTaskCount(match.getEmployeeId());
                    String reasoning = chatClient.prompt()
                            .user(String.format("Task: %s. BERT Score: %.2f. Workload: %d tasks.", 
                                  draft.taskName(), match.getScore(), activeTasks.size()))
                            .call().content();
                    enhancedList.add(new Recommendation(match.getEmployeeId(), match.getScore(), reasoning));
                });
            }
            suggestionsMap.put(draft.id(), enhancedList);
        }
        return new AutomationResponse(suggestionsMap);
    }
}