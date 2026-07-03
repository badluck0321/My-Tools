package com.example.BackEnd_MyTools.bootstrap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataSeeder implements ApplicationRunner {
    private final AllEntitiesSeeder allEntitiesSeeder;

    @Value("${mytools.seed.enabled:true}")
    private boolean seedEnabled;

    public DataSeeder(AllEntitiesSeeder allEntitiesSeeder) { this.allEntitiesSeeder = allEntitiesSeeder; }

    @Override public void run(ApplicationArguments args) {
        if (!seedEnabled) {
            System.out.println("[Seeder] Demo seeding disabled by mytools.seed.enabled=false");
            return;
        }
        allEntitiesSeeder.seedAll();
    }
}
