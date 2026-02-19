package com.pharmacy.medlan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MedlanApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedlanApplication.class, args);
	}

}
