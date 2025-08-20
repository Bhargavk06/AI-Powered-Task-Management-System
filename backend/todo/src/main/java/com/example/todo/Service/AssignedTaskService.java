package com.example.todo.Service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todo.AssignedTask;
import com.example.todo.Profile;
import com.example.todo.Repository.AssignedTaskRepository;
import com.example.todo.Repository.ProfileRepository;

@Service
public class AssignedTaskService {
    
    @Autowired
    private AssignedTaskRepository assignedtaskrepo;
    
    @Autowired
    private EmailService emailService;

    @Autowired
    private ProfileRepository profileRepo;

    
    public void storeAssignedTask(AssignedTask assignedtask) {
        assignedtaskrepo.save(assignedtask);

        // Lookup assignee email
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

    
    public List<AssignedTask> getAllTasks(String assigneeId){
        return assignedtaskrepo.findByAssigneeId(assigneeId);
    }
    
    public void updateStatus(Long taskId, String status) {
        java.util.Optional<AssignedTask> optionalTask = assignedtaskrepo.findById(taskId);
        if (optionalTask.isPresent()) {
            AssignedTask task = optionalTask.get();
            task.setStatus(status);
            assignedtaskrepo.save(task); // Save updated status
        } else {
            throw new RuntimeException("Task with ID " + taskId + " not found.");
        }
    }

    // <--- Added method --->
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
            assignedtaskrepo.save(existingTask);
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
