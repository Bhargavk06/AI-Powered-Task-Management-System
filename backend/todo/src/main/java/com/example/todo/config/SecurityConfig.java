package com.example.todo.config;

import com.example.todo.filter.JWTFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration; 
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; 
import org.springframework.web.filter.CorsFilter; 

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JWTFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Add the cors() configuration here.
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            .csrf(csrf -> csrf.disable())
            
            .authorizeHttpRequests(auth -> auth
                // Explicitly permit all OPTIONS requests. This is crucial for preflight.
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Keep your existing public endpoints
                .requestMatchers("/user/login", "/user/register").permitAll()
                
                .requestMatchers("/api/assistant/**").permitAll()

                .requestMatchers("/api/gemini/**").permitAll() 
                
                .anyRequest().authenticated()
            )

            
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Add this Bean to configure CORS globally.
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow requests from your React frontend
        configuration.addAllowedOrigin("http://localhost:3000"); 
        
        // Allow all standard methods (GET, POST, PUT, DELETE, OPTIONS)
        configuration.addAllowedMethod("*"); 
        
        // Allow all headers, including Authorization
        configuration.addAllowedHeader("*"); 
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        
        // Apply this configuration to all paths in your application
        source.registerCorsConfiguration("/**", configuration); 
        
        return source;
    }
}


// package com.example.todo.Config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.cors.CorsConfiguration;
// import java.util.List;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//             // 1. Disable CSRF (Required for POST requests to work)
//             .csrf(csrf -> csrf.disable())
            
//             // 2. Configure CORS so your Frontend (3000) can talk to Backend (8080)
//             .cors(cors -> cors.configurationSource(request -> {
//                 CorsConfiguration config = new CorsConfiguration();
//                 config.setAllowedOrigins(List.of("http://localhost:3000"));
//                 config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//                 config.setAllowedHeaders(List.of("*"));
//                 return config;
//             }))

//             // 3. Allow all requests to your Gemini endpoint without authentication
//             .authorizeHttpRequests(auth -> auth
//                 .requestMatchers("/api/gemini/**").permitAll() 
//                 .anyRequest().authenticated()
//             )

//             // 4. Disable the default login popups/forms
//             .httpBasic(basic -> basic.disable())
//             .formLogin(form -> form.disable());

//         return http.build();
//     }
// }