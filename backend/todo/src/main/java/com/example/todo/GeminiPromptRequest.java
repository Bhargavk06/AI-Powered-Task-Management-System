package com.example.todo;
	
public class GeminiPromptRequest {
    private String prompt;

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    @Override
    public String toString() {
        return "GeminiPromptRequest{prompt='" + prompt + "'}";
    }
}
