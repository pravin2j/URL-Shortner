package com.pj.url_shortner.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;

@Entity
@Data
public class Url {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long urlId;
	@Lob
	@Column(unique = true, columnDefinition = "TEXT")
	private String inputUrl;
	@Column(unique = true)
	private String outputUrl;
	private LocalDateTime generatedDateTime;
	private LocalDateTime expirationDateTime;
}
