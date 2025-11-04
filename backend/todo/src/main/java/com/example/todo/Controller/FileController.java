package com.example.todo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.todo.FileEntity;
import com.example.todo.Service.FileStorageService;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api") 
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/tasks/{taskId}/files")
    public ResponseEntity<?> uploadFileForTask(
            @PathVariable Long taskId, 
            @RequestParam("file") MultipartFile file) {
        
        try {
            // This service method call is now correct.
            fileStorageService.storeFile(file, taskId);
            
            return ResponseEntity.ok(Map.of(
                "message", "File uploaded successfully for task " + taskId
            ));
        } catch (IOException e) {
            // It's good practice to handle potential IOExceptions during file processing.
            return ResponseEntity.status(500).body("Could not upload the file: " + e.getMessage());
        }
    }

    // NEW: Endpoint to get the LIST of all files for a task.
    // The frontend needs this to display the download links.
    @GetMapping("/tasks/{taskId}/files")
    public ResponseEntity<List<Map<String, Object>>> getFileListForTask(@PathVariable Long taskId) {
        List<Map<String, Object>> files = fileStorageService.getFilesByTaskId(taskId).stream()
                .map(file -> Map.of(
                        "id", (Object) file.getId(),
                        "filename", (Object) file.getFilename()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(files);
    }


    // CORRECTED: Endpoint to download a SINGLE file by its unique fileId.
    // The URL now clearly indicates we are getting a file by its own ID.
    @GetMapping("/files/{fileId}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long fileId) {
        // ERROR FIXED: Was incorrectly calling getFilesByTaskId.
        // Now correctly calls a new service method to get a single file.
        FileEntity fileEntity = fileStorageService.getFile(fileId);

        return ResponseEntity.ok()
                // CHANGED: "attachment" prompts a download. "inline" tries to display it in the browser.
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(fileEntity.getContentType()))
                .body(fileEntity.getData());
    }
}