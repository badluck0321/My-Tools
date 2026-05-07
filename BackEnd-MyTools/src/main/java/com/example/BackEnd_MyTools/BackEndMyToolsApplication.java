package com.example.BackEnd_MyTools;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  

public class BackEndMyToolsApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackEndMyToolsApplication.class, args);
	}

}
