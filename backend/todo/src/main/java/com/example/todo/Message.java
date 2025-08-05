package com.example.todo;

public class Message {
    private String content;

    // Default constructor (required)
    public Message() {}

    // Constructor with parameter
    public Message(String content) {
        this.content = content;
    }

    // Getter and Setter
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
