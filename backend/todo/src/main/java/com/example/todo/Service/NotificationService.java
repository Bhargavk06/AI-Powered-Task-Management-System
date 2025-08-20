package com.example.todo.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.todo.Notifications;
import com.example.todo.Repository.NotificationRepository;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Save to DB + send to WebSocket subscriber
    public void sendNotification(String senderId, String receiverId, String message) {
        Notifications notification = new Notifications(senderId, receiverId, message);
        notificationRepository.save(notification);

        // Push to WebSocket
        String destination = "/topic/user/" + receiverId;
        messagingTemplate.convertAndSend(destination, notification);
    }

    // Get all notifications for a user
    public List<Notifications> getUserNotifications(String userId) {
        return notificationRepository.findByReceiverIdOrderByTimestampDesc(userId);
    }
    
    public void saveNotification(Notifications notification) {
        notificationRepository.save(notification);
    }

}
