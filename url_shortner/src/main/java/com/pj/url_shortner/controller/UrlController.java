package com.pj.url_shortner.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;

import com.pj.url_shortner.dto.Url;
import com.pj.url_shortner.service.UrlService;
import com.pj.url_shortner.util.ResponseStructure;

import jakarta.servlet.http.HttpServletResponse;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class UrlController {

	@Autowired
	private UrlService urlService;
	
	@GetMapping("/getAllUrl") 
	public ResponseEntity<ResponseStructure<List<Url>>> getAllUrls(){
		return urlService.getAllUrl();
	}
	
	@PostMapping("/createUrl")
	public ResponseEntity<ResponseStructure<Url>> createUrl(@RequestBody Url url) {
		return urlService.createUrl(url);
	}
	
	@PostMapping("/customUrl")
	public ResponseEntity<ResponseStructure<Url>> createCustomUrl(@RequestBody Url url) {
		return urlService.customUrl(url);
	}
	
	@GetMapping("/{urlSlug}")
	public void redirectUrl(@PathVariable String urlSlug, HttpServletResponse response) throws IOException{
		String originalUrl = urlService.getOriginalUrl(urlSlug);

		if(originalUrl != null) {
			response.sendRedirect(originalUrl);
		}
		else {
			response.sendError(HttpStatus.NOT_FOUND.value(), "URL Not Found");
		}
	}
}
