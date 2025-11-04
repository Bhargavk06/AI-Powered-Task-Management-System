package com.example.todo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
public class AssignedTask {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) 
    private Long taskId;

    private String taskname;
    private String description;
    private String status;
    private String deadline;
    private String priority;

    @ManyToOne
    @JoinColumn(name = "assignee_id", referencedColumnName = "id")
    @JsonIgnore
    private UserAuthentication assignee;
    
    @ManyToOne
    @JoinColumn(name = "assigned_by_id", referencedColumnName = "id")
    @JsonIgnore
    private UserAuthentication assignedBy;
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FileEntity> files;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id") // This will create a 'project_id' foreign key column
    @JsonIgnore
    private ProjectEntity project;
    
    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }

    public UserAuthentication getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(UserAuthentication assignedBy) {
        this.assignedBy = assignedBy;
    }


    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public UserAuthentication getAssignee() {
        return assignee;
    }

    public void setAssignee(UserAuthentication assignee) {
        this.assignee = assignee;
    }
    
    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
