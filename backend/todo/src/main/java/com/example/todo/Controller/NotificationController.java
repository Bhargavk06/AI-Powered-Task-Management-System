package com.example.todo.Controller;

import com.example.todo.Notifications;
import com.example.todo.Service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    
    @GetMapping("/user/{userId}")
    public List<Notifications> getNotificationsByUserId(@PathVariable String userId) {
        return notificationService.getUserNotifications(userId);
    }
    
    @PostMapping("/save")
    public String saveNotification(@RequestBody Notifications notification) {
        notificationService.saveNotification(notification);
        return "Notification saved";
    }
    
}
