
package com.example.demo.util;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component

public class Jwtfilter  extends OncePerRequestFilter{
	@Autowired
	private JwtUtil jwtUtil;
	
@Override
protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain filterChain)throws ServletException,IOException{
	
	String authHeader=request.getHeader("Authorization");
	
	if(authHeader !=null && authHeader.startsWith("Bearer ")) {
		String token=authHeader.substring(7);
		if(jwtUtil.validateJwtToken(token)) {
			String email=jwtUtil.extractemail(token);
			UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(email,null,List.of());
			authToken.setDetails(new org.springframework.security.web.authentication.WebAuthenticationDetailsSource().buildDetails(request));
			SecurityContextHolder.getContext().setAuthentication(authToken);
			
			
			
		}
	}
	filterChain.doFilter(request, response);
}
}
