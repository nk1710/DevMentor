package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agora")
public class AgoraTokenController {

    @Value("${agora.app-id:}")
    private String appId;

    @GetMapping("/token")
    public AgoraTokenResponse getToken(
            @RequestParam String channelName,
            @RequestParam(defaultValue = "0") Integer uid) {
        // Current deployment supports Agora testing mode. For secured channels,
        // wire an Agora token builder here and return a signed token.
        return new AgoraTokenResponse(appId, channelName, uid, null, false);
    }

    @GetMapping("/config")
    public AgoraConfigResponse getConfig() {
        return new AgoraConfigResponse(appId);
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

    public record AgoraTokenResponse(
            String appId,
            String channelName,
            Integer uid,
            String token,
            boolean tokenRequired) {}

    public record AgoraConfigResponse(String appId) {}
}
