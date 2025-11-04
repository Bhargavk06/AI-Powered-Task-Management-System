package com.example.todo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "files")
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "filename")
    private String filename;

    @Column(name = "mimetype")
    private String contentType;

    @Lob
    @Column(name = "file_data", columnDefinition = "BLOB")
    private byte[] data;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false) // This creates the task_id foreign key
    @JsonIgnore // Prevents infinite loops when serializing to JSON
    private AssignedTask task;

    // 1. A public no-argument constructor (REQUIRED BY JPA)
    public FileEntity() {
    }

    // 2. A constructor for your convenience when creating a new file
    public FileEntity(String filename, String contentType, byte[] data) {
        this.filename = filename;
        this.contentType = contentType;
        this.data = data;
    }

    // --- 3. Manual Getters and Setters for all fields ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }
    
 // In FileEntity class
    public AssignedTask getTask() {
        return task;
    }

    public void setTask(AssignedTask task) {
        this.task = task;
    }
}