package com.example.todo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.todo.UserAuthentication;
import com.example.todo.Service.UserService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserService userservice;
	
	
	@PostMapping("/register")
	public String register(@RequestBody UserAuthentication user) {
	    // Jackson converts JSON → UserAuthentication object
		userservice.registerUser(user);
		return "Registered successfully";
	}

	@PostMapping("/login")
	public String getDetails(@RequestBody UserAuthentication user) {
		boolean success=userservice.verifyUser(user.getId(),user.getPassword(),user.getRole());
		if(success) {
			return "Login successful";
		}
		else {
			return "Invalid Credentials";
		}
	}
	
	

}
