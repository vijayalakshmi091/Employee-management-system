package com.example.demo.controller;

import java.util.Map;
import java.util.Optional;
import com.example.demo.entity.Userentity;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Userentity;
import com.example.demo.repository.Userrepo;
import com.example.demo.util.JwtUtil;

@RestController
@RequestMapping("/auth")

public class Authcontroller {
	@Autowired 
	private AuthenticationManager authenticationManager;
	@Autowired
	private Userrepo repo;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtUtil jwtutil;
	
	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody Map<String ,String>body) {
		 String email=body.get("email");
		 String password= passwordEncoder.encode(body.get("password"));
		 try {
		 
		 if( repo.findByEmail(email).isPresent()) {
			 return new  
					 ResponseEntity<>( "Email already exists",HttpStatus.CONFLICT);
		 }
		 Userentity User=new Userentity();
		 User.setEmail(email);
		 User.setPassword(password);
		 repo.save(User);
		 return new
				 ResponseEntity<>("user registed successfully",HttpStatus.CREATED);
			 
		 }catch( Exception e) {
			 return new ResponseEntity<>("Error:"+e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
		 }
			 
		}
	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody Map<String, String> body) {
	    String email = body.get("email");
	    String password = body.get("password");

	    Optional<Userentity> userOpt = repo.findByEmail(email);

	    if (userOpt.isPresent() ) {
	    	Userentity user=userOpt.get();
	    	if(passwordEncoder.matches(password, user.getPassword())){
	    		
	    
	        String token = jwtutil.generateToken(email);
	        return ResponseEntity.ok(Map.of("token", token));
	    } 
	    }
	        return
	        		ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
	    }
	

}
