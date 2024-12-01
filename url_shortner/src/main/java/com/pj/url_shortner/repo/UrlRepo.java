package com.pj.url_shortner.repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pj.url_shortner.dto.Url;

@Repository
public interface UrlRepo extends JpaRepository<Url, Long> {

	public List<Url> findByExpirationDateTimeBefore(LocalDateTime dateTime);
}
