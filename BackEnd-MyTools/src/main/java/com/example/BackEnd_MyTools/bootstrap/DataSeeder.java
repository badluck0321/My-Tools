package com.example.BackEnd_MyTools.bootstrap;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataSeeder implements ApplicationRunner {
    private final AllEntitiesSeeder allEntitiesSeeder;
    public DataSeeder(AllEntitiesSeeder allEntitiesSeeder) { this.allEntitiesSeeder = allEntitiesSeeder; }
    @Override public void run(ApplicationArguments args) { allEntitiesSeeder.seedAll(); }
}
