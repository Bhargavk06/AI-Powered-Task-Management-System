package com.example.todo.Controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import com.example.todo.Message;

@RestController
public class PingPongDemo {

    @MessageMapping("/ping") // Receives from client at /app/ping
    @SendTo("/topic/pong")   // Sends to clients subscribed to /topic/pong
    public Message getPong(Message message) {
        System.out.println("Received: " + message.getContent());
        return new Message("Pong: " + message.getContent());
    }
}

