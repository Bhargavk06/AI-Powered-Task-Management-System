package com.example.todo.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiService {
    private final Client client = new Client();

    public String askGemini(String prompt) {
        GenerateContentResponse response = client.models.generateContent(
        		"gemini-2.5-flash",prompt,null);
        return response.text();
    }
}
