package com.example.todo.dto;

import java.util.List;
import lombok.Data;

@Data
public class UploadResult {
    private int successCount;
    private int failureCount;
    private List<RowError> errors;

    @Data
    public static class RowError {
        private int rowNumber;
        private String userId;
        private String reason;

        public RowError(int rowNumber, String userId, String reason) {
            this.rowNumber = rowNumber;
            this.userId = userId;
            this.reason = reason;
        }
    }
}