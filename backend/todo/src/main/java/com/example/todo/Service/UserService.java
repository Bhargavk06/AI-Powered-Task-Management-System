package com.example.todo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todo.UserAuthentication;
import com.example.todo.Repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userrepo;
	public boolean verifyUser(String id,String password, String role) {
		Optional<UserAuthentication> userOpt=userrepo.findByIdAndPasswordAndRole(id,password,role);
		if(userOpt.isPresent()) {
			return true;
		}
		return false;
		
	}
	
	public void registerUser(UserAuthentication user) {
		userrepo.save(user);
	}
	
	

}
