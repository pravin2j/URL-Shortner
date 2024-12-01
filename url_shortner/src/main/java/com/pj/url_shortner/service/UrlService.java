package com.pj.url_shortner.service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.pj.url_shortner.dto.Url;
import com.pj.url_shortner.repo.UrlRepo;

@Service
public class UrlService {
	@Autowired
	UrlRepo urlRepo;
	
	private static final String CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	public List<Url> getAllUrl() {
		return urlRepo.findAll();
	}
	
	public String createUrl(String inputUrl) {
		String encodedUrl = "";
		List<Url> allUrls = urlRepo.findAll();
		boolean containsUrl = false;
		for (Url url : allUrls) {
		    if (url.getInputUrl().equals(inputUrl)) {
		        containsUrl = true;
		        encodedUrl = url.getOutputUrl();
		        break; 
		    }
		}
		if(!containsUrl) {			
			long hashedUrl = hashUrl(inputUrl);
			encodedUrl = base62Encode(hashedUrl);
			LocalDateTime generateDateTime = LocalDateTime.now();
	
			Url newUrl = new Url();
			newUrl.setInputUrl(inputUrl);
			newUrl.setOutputUrl(encodedUrl);
			newUrl.setGeneratedDateTime(generateDateTime);
			newUrl.setExpirationDateTime(generateDateTime.plusMinutes(1));
			urlRepo.save(newUrl);;
		}
		return encodedUrl;
	}
	
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
    
    @Scheduled(cron = "0 * * * * ?")
    public void handleExpiredUrl() {
    	LocalDateTime now = LocalDateTime.now();
    	List<Url> expiredUrls = urlRepo.findByExpirationDateTimeBefore(now);
    	System.out.println(expiredUrls);
    	
    	if(!expiredUrls.isEmpty()) {
    		urlRepo.deleteAll(expiredUrls);
    	}
    }
}


