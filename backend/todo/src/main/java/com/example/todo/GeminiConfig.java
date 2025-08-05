package com.example.todo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.genai.Client;

@Configuration
public class GeminiConfig {
	
	@Bean
	public Client GeminiClient() {
		return new Client();
		
	}
}
