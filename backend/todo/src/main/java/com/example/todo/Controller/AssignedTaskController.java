package com.example.todo.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.todo.AssignedTask;
import com.example.todo.Service.AssignedTaskService;
import com.example.todo.Service.NotificationService;
import com.example.todo.UserAuthentication;
import com.example.todo.Repository.UserRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/assigntask")
public class AssignedTaskController {

    @Autowired
    private AssignedTaskService assignedtaskservice;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private NotificationService notificationService;

    // Assign Task + Send Notification to Assignee
    @PostMapping("/assign/{assigneeId}")
    public ResponseEntity<String> assignTask(
        @PathVariable String assigneeId,
        @RequestParam String assignerId,
        @RequestBody AssignedTask assignedtask) {

        UserAuthentication assignee = userRepo.findById(assigneeId).orElse(null);
        UserAuthentication assigner = userRepo.findById(assignerId).orElse(null);

        if (assignee == null || assigner == null) {
            return ResponseEntity.badRequest().body("Assignee or Assigner not found.");
        }

        assignedtask.setAssignee(assignee);
        assignedtask.setAssignedBy(assigner);
        assignedtaskservice.storeAssignedTask(assignedtask);

        notificationService.sendNotification(
            assigner.getId(),
            assignee.getId(),
            "You have been assigned a new task: " + assignedtask.getTaskname()
        );

        return ResponseEntity.ok("Task assigned successfully.");
    }


    // Get all tasks assigned to a user
    @GetMapping("/gettask/{assigneeId}")
    public List<AssignedTask> getTasks(@PathVariable String assigneeId) {
        return assignedtaskservice.getAllTasks(assigneeId);
    }

    // Update task status + Send notification to assigner
    @PutMapping("/updateStatus")
    public void updateStatus(@RequestBody Map<String, String> data) {
        Long taskId = Long.parseLong(data.get("taskId"));
        String status = data.get("status");

        // Update task status in DB
        assignedtaskservice.updateStatus(taskId, status);

        // Get task to find assigner and assignee
        AssignedTask task = assignedtaskservice.getTaskById(taskId);

        if (task != null && task.getAssignedBy() != null) {
            String senderId = task.getAssignee().getId();
            String receiverId = task.getAssignedBy().getId();

            notificationService.sendNotification(
                senderId,
                receiverId,
                "Task '" + task.getTaskname() + "' marked as '" + status + "'"
            );
        }
    }

    // Delete task
    @DeleteMapping("/deleteTask/{id}")
    public ResponseEntity<String> deleteAssignedTask(@PathVariable Long id) {
        assignedtaskservice.deleteTaskById(id);
        return ResponseEntity.ok("Task deleted successfully");
    }

    // Update task
    @PutMapping("/updateTask")
    public ResponseEntity<String> updateTask(@RequestBody AssignedTask updatedTask) {
        assignedtaskservice.updateTask(updatedTask);
        return ResponseEntity.ok("Task updated successfully");
    }

    // Dashboard summary for Admin
    @GetMapping("/totalSummary")
    public List<Integer> totalSummary() {
        return assignedtaskservice.fetchTotalSummary();
    }

    // Employee summary dashboard
    @GetMapping("/totalEmployeeSummary")
    public List<Integer> totalEmployeeSummary() {
        return assignedtaskservice.fetchTotalEmployeeSummary();
    }

    // Manager summary dashboard
    @GetMapping("/totalManagerSummary")
    public List<Integer> totalManagerSummary() {
        return assignedtaskservice.fetchTotalManagerSummary();
    }
}
