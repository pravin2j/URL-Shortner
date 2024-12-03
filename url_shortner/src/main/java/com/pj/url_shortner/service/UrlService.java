package com.pj.url_shortner.service;

import java.io.IOException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.pj.url_shortner.dto.Url;
import com.pj.url_shortner.repo.UrlRepo;
import com.pj.url_shortner.util.ResponseStructure;

@Service
public class UrlService {
	@Autowired
	private UrlRepo urlRepo;
	private static final String CHARACTERS = "abcdefghijklmnopqstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private ResponseStructure<Url> responseStructure = new ResponseStructure<Url>();
	private ResponseStructure<List<Url>> responseStructure2 = new ResponseStructure<List<Url>>();
	
	public static String base62Encode(long num) {
        StringBuilder encodedUrl = new StringBuilder();
        while (num > 0 && encodedUrl.length()<7) {
            encodedUrl.append(CHARACTERS.charAt((int) (num % CHARACTERS.length())));
            num /= CHARACTERS.length();
        }
        return encodedUrl.reverse().toString();
    }

    private static long hashUrl(String url) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] hashBytes = md.digest(url.getBytes());
            BigInteger hashValue = new BigInteger(1, hashBytes);
            return Math.abs(hashValue.longValue());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating hash for URL", e);
        }
    }
	
	
	public ResponseEntity<ResponseStructure<Url>> createUrl(Url url) {
		String inputUrl = url.getInputUrl();
		String encodedUrl = "";
		List<Url> allUrls = urlRepo.findAll();
		boolean containsUrl = false;
		for (Url dbUrl : allUrls) {
		    if (dbUrl.getInputUrl().equals(inputUrl)) {
		        containsUrl = true;
		        url.setOutputUrl(dbUrl.getOutputUrl());
		        break;
		    }
		}
		if(!containsUrl) {			
			long hashedUrl = hashUrl(inputUrl);
			encodedUrl = base62Encode(hashedUrl);
			LocalDateTime generateDateTime = LocalDateTime.now();
			
			url.setOutputUrl(encodedUrl);
			url.setGeneratedDateTime(generateDateTime);
			url.setExpirationDateTime(generateDateTime.plusSeconds(30));
			responseStructure.setMessage("URL Saved Successfully");
			responseStructure.setStatus(HttpStatus.CREATED.value());
			responseStructure.setData(urlRepo.save(url));
			return new ResponseEntity<ResponseStructure<Url>>(responseStructure, HttpStatus.CREATED);
		} else {
			responseStructure.setData(url);
			responseStructure.setMessage("URL Already Exists");
			responseStructure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<Url>>(responseStructure, HttpStatus.OK);
		}
	}
	
    public String getOriginalUrl(String urlSlug) {
    	String originalUrl = null;
    	List<Url> allUrls = urlRepo.findAll();
    	for ( Url url1: allUrls) {
    		if( url1.getOutputUrl().equals(urlSlug)) {
    			originalUrl = url1.getInputUrl();
    			break;
    		}
    	}
    	return originalUrl;
    }
    
    //custom url shortner
    public ResponseEntity<ResponseStructure<Url>> customUrl(Url url) {
    	
    	List<Url> allUrls = urlRepo.findAll();
    	boolean containsUrl = false;
    	for(Url urldb: allUrls) {
    		if(urldb.getOutputUrl().equals(url.getOutputUrl())) {
    			containsUrl = true;
    			url.setInputUrl(urldb.getInputUrl());
    			break;
    		}
    	}
    	if(!containsUrl) {
    		url.setGeneratedDateTime(LocalDateTime.now());
    		if(url.getExpirationDateTime()==null) {
    			url.setExpirationDateTime(url.getGeneratedDateTime().plusDays(30));
    		}
    		responseStructure.setMessage("URL Saved Successfully");
    		responseStructure.setData(urlRepo.save(url));
    		responseStructure.setStatus(HttpStatus.CREATED.value());
    		return new ResponseEntity<ResponseStructure<Url>>(responseStructure, HttpStatus.CREATED);
    	} else {
    		url.setGeneratedDateTime(null);
    		url.setExpirationDateTime(null);
    		responseStructure.setMessage("Shorten URL Already Exists");
    		responseStructure.setStatus(HttpStatus.OK.value());
    		responseStructure.setData(url);
    		return new ResponseEntity<ResponseStructure<Url>>(responseStructure, HttpStatus.OK);
    	}
    }
    
    @Scheduled(cron = "0 0 0 * * ?")
    public void handleExpiredUrl() throws IOException {
        System.out.println("Scheduler triggered.");
        LocalDateTime now = LocalDateTime.now();
        List<Url> expiredUrls = urlRepo.findByExpirationDateTimeBefore(now);
        System.out.println("Expired URLs: " + expiredUrls);

        if (!expiredUrls.isEmpty()) {
            urlRepo.deleteAll(expiredUrls);
        } else {
            System.out.println("No expired URLs found.");
        }
    }

    public ResponseEntity<ResponseStructure<List<Url>>> getAllUrl() {
    	if(urlRepo.findAll()!=null) {
    		responseStructure2.setMessage("All URL Successfully");
    		responseStructure2.setData(urlRepo.findAll());
    		responseStructure2.setStatus(HttpStatus.OK.value());
    		return new ResponseEntity<ResponseStructure<List<Url>>>(responseStructure2,HttpStatus.OK);
    	}
    	else return null;
    }
}


