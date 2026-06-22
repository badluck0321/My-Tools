package com.example.BackEnd_MyTools.Controllers;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.example.BackEnd_MyTools.Services.AnalyticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(analyticsService.dashboard(jwt));
    }

    @GetMapping("/orders.csv")
    public ResponseEntity<byte[]> ordersCsv(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("text/csv"))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=orders.csv")
            .body(analyticsService.ordersCsv(jwt));
    }
}
