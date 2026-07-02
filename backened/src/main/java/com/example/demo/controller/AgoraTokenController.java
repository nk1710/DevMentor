package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/agora")
public class AgoraTokenController {

    @Value("${agora.app-id:}")
    private String appId;

    @GetMapping("/token")
    public ResponseEntity<?> getToken(
            @RequestParam String channelName,
            @RequestParam(defaultValue = "0") Long uid) {

        if (appId == null || appId.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Agora App ID not configured"));
        }

        return ResponseEntity.ok(Map.of(
            "appId", appId,
            "channelName", channelName,
            "uid", uid,
            "token", (Object) null,
            "tokenRequired", false
        ));
    }

    @GetMapping("/config")
    public ResponseEntity<?> getConfig() {
        if (appId == null || appId.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Agora App ID not configured"));
        }
        return ResponseEntity.ok(Map.of("appId", appId));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
