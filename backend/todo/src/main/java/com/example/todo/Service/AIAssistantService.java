package com.example.todo.Service;

import com.example.todo.AssignedTask;
import com.example.todo.Service.AssignedTaskService;
import com.example.todo.config.AiAssistantConfig;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIAssistantService {

    private final ChatClient chatClient;
    private final AiAssistantConfig.TaskTools taskTools;

    public AIAssistantService(ChatClient.Builder builder, AiAssistantConfig.TaskTools taskTools) {
        this.taskTools = taskTools;
        this.chatClient = builder
                .defaultSystem("""
                    You are an intelligent Task Management Assistant that helps employees prioritize and manage their tasks effectively.

                    Your capabilities:
                    1. Use 'getTasks' to find tasks by specific criteria (manager, priority, deadline)
                    2. Use 'getWorkloadAdvice' to get task recommendations based on available time
                    3. Use 'getTasksByAssigner' to get tasks assigned TO YOU by a specific person
                    4. Analyze task data to provide smart recommendations
                    5. Explain your reasoning clearly and helpfully

                    CRITICAL INSTRUCTION FOR TASK LISTING:
                    When using getTasksByAssigner or any tool that returns multiple tasks:
                    - ALWAYS list EVERY SINGLE TASK returned by the tool
                    - NEVER summarize or pick just one task as an example
                    - Format each task with its name, description, deadline, priority, and status
                    - Use a numbered or bulleted list format
                    - If the tool returns 5 tasks, show all 5 tasks
                    - If the tool returns 10 tasks, show all 10 tasks
                    - Do not say "Here are some tasks" or "For example" - show ALL of them
                    - Count the tasks and explicitly state "Here are all X tasks assigned to you by [assigner]:"

                    When users ask for tasks assigned by someone:
                    - Use getTasksByAssigner to get tasks assigned TO THEM by that person
                    - Display ALL tasks found, not just a summary or one example
                    - List each task with its details (name, description, deadline, priority, status)
                    - If no tasks are found, clearly state that
                    - Format the response as a clear, numbered or bulleted list

                    When users ask about time-based task recommendations:
                    - Use getWorkloadAdvice with their available hours
                    - Analyze the returned tasks
                    - Explain WHY you recommend these specific tasks
                    - Consider priority levels, deadlines, and time constraints
                    - Be specific about your selection criteria

                    Always provide clear, actionable advice with reasoning.
                    """)
                .build();
    }

    public String handleUserMessage(String userId, String userMessage) {
        try {
            AiAssistantConfig.FOR_USER_ID.set(userId);

            return chatClient.prompt()
                    .user(userMessage)
                    .tools(taskTools)
                    .call()
                    .content();
        } finally {
            AiAssistantConfig.FOR_USER_ID.remove();
        }
    }
}