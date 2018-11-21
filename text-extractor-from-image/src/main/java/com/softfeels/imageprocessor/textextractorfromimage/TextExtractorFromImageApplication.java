package com.softfeels.imageprocessor.textextractorfromimage;

import com.softfeels.imageprocessor.textextractorfromimage.models.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties({
		FileStorageProperties.class
})
@SpringBootApplication
public class TextExtractorFromImageApplication {

	public static void main(String[] args) {
		SpringApplication.run(TextExtractorFromImageApplication.class, args);
	}
}
