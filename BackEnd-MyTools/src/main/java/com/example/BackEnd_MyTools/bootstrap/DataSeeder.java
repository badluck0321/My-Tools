package com.example.BackEnd_MyTools.bootstrap;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataSeeder implements ApplicationRunner {

    private final MasterySeeder masterySeeder;
    private final ProductSeeder productSeeder;

    public DataSeeder(MasterySeeder masterySeeder, ProductSeeder productSeeder) {
        this.masterySeeder = masterySeeder;
        this.productSeeder = productSeeder;
    }

    @Override
    public void run(ApplicationArguments args) {
        masterySeeder.seed();
        productSeeder.seed();
    }
}