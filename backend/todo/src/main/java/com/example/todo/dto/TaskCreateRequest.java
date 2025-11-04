package com.example.todo.dto;

// This is a plain Java object (POJO) for transferring data. It is NOT a database entity.
public class TaskCreateRequest {

    private String taskname;
    private String description;
    private String deadline;
    private String priority;
    
    // This will hold the ID of the user the task is being assigned TO.
    private String assigneeId;


    public String getTaskname() {
        return taskname;
    }

    public void setTaskname(String taskname) {
        this.taskname = taskname;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(String assigneeId) {
        this.assigneeId = assigneeId;
    }
    
    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}