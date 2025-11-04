package com.example.todo.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todo.AssignedTask;
import com.example.todo.Profile;
import com.example.todo.ProjectEntity;
import com.example.todo.UserAuthentication;
import com.example.todo.Repository.AssignedTaskRepository;
import com.example.todo.Repository.ProfileRepository;
import com.example.todo.Repository.ProjectRepository;
import com.example.todo.Repository.UserRepository;
import com.example.todo.dto.TaskCreateRequest;
import com.example.todo.dto.TaskDto;

@Service
public class AssignedTaskService {
    
    @Autowired
    private AssignedTaskRepository assignedtaskrepo;
    
    @Autowired
    private EmailService emailService;

    @Autowired
    private ProfileRepository profileRepo;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<TaskDto> getTasksByProjectAndUser(Long projectId, String userId) {
        List<AssignedTask> tasks = assignedtaskrepo.findByProjectIdAndAssigneeId(projectId, userId);
        
        // Convert the list of entities into a list of DTOs
        return tasks.stream()
                    .map(TaskDto::new) // Uses the constructor we created in TaskDto
                    .collect(Collectors.toList());
    }
    
    public List<TaskDto> getAllTasks(String assigneeId){
    	List<AssignedTask> tasks = assignedtaskrepo.findByAssigneeId(assigneeId);
    	return tasks.stream()
                .map(TaskDto::new) // Uses the constructor we created in TaskDto
                .collect(Collectors.toList());
    }
    
    public List<TaskDto> getAllIncompleteTasks(String assigneeId){
    	List<String> activeStatuses = List.of("To Do", "In Progress");
    	List<AssignedTask> tasks = assignedtaskrepo.findByAssigneeIdAndStatusIn(assigneeId,activeStatuses);
    	return tasks.stream()
                .map(TaskDto::new) 
                .collect(Collectors.toList());
    }
    
    public AssignedTask createTask(TaskCreateRequest taskRequest, String assignedById, Long projectId) {
        UserAuthentication assignedBy = userRepository.findById(assignedById)
                .orElseThrow(() -> new RuntimeException("Assigner not found"));
        UserAuthentication assignee = userRepository.findById(taskRequest.getAssigneeId())
                .orElseThrow(() -> new RuntimeException("Assignee not found"));
        
        // Find the project to link the task to
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        AssignedTask newTask = new AssignedTask();
        newTask.setTaskname(taskRequest.getTaskname());
        newTask.setDescription(taskRequest.getDescription());
        newTask.setDeadline(taskRequest.getDeadline());
        newTask.setStatus("To Do");
        newTask.setPriority(taskRequest.getPriority());
        newTask.setAssignedBy(assignedBy);
        newTask.setAssignee(assignee);
        newTask.setProject(project); 
        
        //sendNewTaskEmail(newTask);

        return assignedtaskrepo.save(newTask);
    }

    
    public void storeAssignedTask(AssignedTask assignedtask) {
        assignedtaskrepo.save(assignedtask); 
        sendNewTaskEmail(assignedtask);
    }
    
    public void sendNewTaskEmail(AssignedTask assignedtask) {
    	
    	String assigneeId = assignedtask.getAssignee().getId();
        Profile assigneeProfile = profileRepo.findById(assigneeId).orElse(null);

        if (assigneeProfile != null && assigneeProfile.getEmail() != null) {
            String toEmail = assigneeProfile.getEmail();
            String subject = "New Task Assigned: " + assignedtask.getTaskname();
            String body = "Hello,\n\nYou have been assigned a new task: "
                + assignedtask.getTaskname()
                + "\nDescription: " + assignedtask.getDescription()
                + "\nDeadline: " + assignedtask.getDeadline()
                + "\n\nPlease check your dashboard for details.";

            emailService.sendEmail(toEmail, subject, body);
        }
    	
    }
    
    public void updateStatus(Long taskId, String status) {
        java.util.Optional<AssignedTask> optionalTask = assignedtaskrepo.findById(taskId);
        if (optionalTask.isPresent()) {
            AssignedTask task = optionalTask.get();
            task.setStatus(status);
            assignedtaskrepo.save(task); 
        } else {
            throw new RuntimeException("Task with ID " + taskId + " not found.");
        }
    }

    
    public AssignedTask getTaskById(Long taskId) {
        return assignedtaskrepo.findById(taskId).orElse(null);
    }
    
    public void deleteTaskById(Long taskId) {
        assignedtaskrepo.deleteById(taskId);
    }
    
    public void updateTask(AssignedTask updatedTask) {
        AssignedTask existingTask = assignedtaskrepo.findById(updatedTask.getTaskId()).orElse(null);
        if (existingTask != null) {
            existingTask.setTaskname(updatedTask.getTaskname());
            existingTask.setDescription(updatedTask.getDescription());
            existingTask.setStatus(updatedTask.getStatus());
            existingTask.setDeadline(updatedTask.getDeadline());
            existingTask.setPriority(updatedTask.getPriority());
            assignedtaskrepo.save(existingTask);
            sendUpdateTaskEmail(existingTask);
        }
    }
    
 public void sendUpdateTaskEmail(AssignedTask assignedtask) {
    	
    	String assigneeId = assignedtask.getAssignee().getId();
        Profile assigneeProfile = profileRepo.findById(assigneeId).orElse(null);

        if (assigneeProfile != null && assigneeProfile.getEmail() != null) {
            String toEmail = assigneeProfile.getEmail();
            String subject = "Task Updated: " + assignedtask.getTaskname();
            String body = "Hello,\n\nYour task has been updated: "
                + assignedtask.getTaskname()
                + "\nDescription: " + assignedtask.getDescription()
                + "\nDeadline: " + assignedtask.getDeadline()
                + "\n\nPlease check your dashboard for details.";

            emailService.sendEmail(toEmail, subject, body);
        }
    	
    }
    
    public List<Integer> fetchTotalSummary(){
        long total = assignedtaskrepo.count();
        int todo = assignedtaskrepo.countByStatus("To Do");
        int inProgress = assignedtaskrepo.countByStatus("In Progress");
        int done = assignedtaskrepo.countByStatus("Done");
        return Arrays.asList((int)total, todo, inProgress, done);
    }
    
    public List<Integer> fetchTotalEmployeeSummary() {
        int total = assignedtaskrepo.countTasksAssignedToEmployees();
        int todo = assignedtaskrepo.countTasksByStatusForEmployees("To Do");
        int inProgress = assignedtaskrepo.countTasksByStatusForEmployees("In Progress");
        int done = assignedtaskrepo.countTasksByStatusForEmployees("Done");
        return Arrays.asList(total, todo, inProgress, done);
    }
    
    public List<Integer> fetchTotalManagerSummary() {
        int total = assignedtaskrepo.countTasksAssignedToManagers();
        int todo = assignedtaskrepo.countTasksByStatusForManagers("To Do");
        int inProgress = assignedtaskrepo.countTasksByStatusForManagers("In Progress");
        int done = assignedtaskrepo.countTasksByStatusForManagers("Done");
        return Arrays.asList(total, todo, inProgress, done);
    }
}
