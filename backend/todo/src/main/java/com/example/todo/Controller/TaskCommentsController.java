package com.example.todo.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.example.todo.TaskComments;
import com.example.todo.Service.TaskCommentsService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/comments")
public class TaskCommentsController {

    @Autowired
    private TaskCommentsService taskcommentsservice;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // View and mark comments as read
    @GetMapping("/view/{taskId}/{userId}")
    public List<TaskComments> viewAndMarkRead(@PathVariable Long taskId, @PathVariable String userId) {
        taskcommentsservice.markCommentsAsReadForTask(taskId, userId);
        return taskcommentsservice.getAllComments(taskId);
    }

    // Add a new comment (and notify via WebSocket)
    @PostMapping("/add")
    public void add(@RequestBody TaskComments comment) {
        // Save the comment and assign unread statuses
        taskcommentsservice.addComment(comment);

        // Notify the other participant(s) (assigner or assignee)
        List<String> recipients = taskcommentsservice.getRecipientsForTask(comment.getTaskId(), comment.getUserId());

        for (String receiverId : recipients) {
        	Map<String, Object> notification = new HashMap<>();
        	notification.put("senderId", comment.getUserId()); // ✅ Who wrote the comment
        	notification.put("receiverId", receiverId);        // ✅ Who should get notified
        	notification.put("message", "🗨️ New comment on Task ID: " + comment.getTaskId());
        	notification.put("timestamp", LocalDateTime.now().toString());

            messagingTemplate.convertAndSend("/topic/user/" + receiverId, notification);
        }

        // Also broadcast comment to all users subscribed to task thread
        messagingTemplate.convertAndSend("/topic/comments/" + comment.getTaskId(), comment);
    }

    // Get unread map for all tasks for this user
    @GetMapping("/unread-map/{userId}")
    public Map<Long, Boolean> getUnreadComments(@PathVariable String userId) {
        return taskcommentsservice.getUnreadCommentMap(userId);
    }
}
