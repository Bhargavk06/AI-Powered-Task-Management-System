package com.example.todo.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {
    
    private final Client client = new Client();

    public String askGemini(String newPrompt, List<Map<String, String>> historyData) {
        
        // 1. Build the single prompt string from the history and the new question.
        //    This part is correct.
        StringBuilder fullPrompt = new StringBuilder();

        if (historyData != null) {
            // We start with the oldest message to build the context correctly
            for (Map<String, String> message : historyData) {
                String role = message.get("role");
                String text = message.get("text");

                if ("user".equals(role)) {
                    fullPrompt.append("User: ").append(text).append("\n\n");
                } else if ("model".equals(role)) {
                    fullPrompt.append("Gemini: ").append(text).append("\n\n");
                }
            }
        }
        
        // 2. Add the user's latest question to the end of the string.
        fullPrompt.append("User: ").append(newPrompt).append("\n\n");
        fullPrompt.append("Gemini:");

        // --- THIS IS THE FINAL FIX ---
        // 3. Call the generateContent method with the exact signature it expects.
        //    We pass the combined prompt string as the second argument.
        //    We pass 'null' for the third argument (GenerateContentConfig) as we don't need it.
        GenerateContentResponse response = client.models.generateContent(
            "gemini-2.5-flash", // Model name
            fullPrompt.toString(),     // The full conversation history as a String
            null                       // Pass null for the optional GenerateContentConfig
        );

        return response.text();
    }
}