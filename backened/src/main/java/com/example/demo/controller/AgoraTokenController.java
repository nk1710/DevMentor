package com.example.demo.controller;

import io.agora.media.RtcTokenBuilder2;
import io.agora.media.RtcTokenBuilder2.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/agora")
public class AgoraTokenController {

    @Value("${agora.app-id:}")
    private String appId;

    @Value("${agora.app-certificate:}")
    private String appCertificate;

    @GetMapping("/token")
    public ResponseEntity<?> getToken(
            @RequestParam String channelName,
            @RequestParam(defaultValue = "0") Integer uid) {

        if (appId == null || appId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Agora App ID is not configured");
        }

        // If certificate is not configured, return null token
        if (appCertificate == null || appCertificate.trim().isEmpty()) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("token", null);
            resp.put("appId", appId.trim());
            return ResponseEntity.ok(resp);
        }

        try {
            RtcTokenBuilder2 tokenBuilder = new RtcTokenBuilder2();
            int tokenExpirationInSeconds = 7200; // 2 hours
            int privilegeExpirationInSeconds = 7200;

            String token = tokenBuilder.buildTokenWithUid(
                    appId.trim(),
                    appCertificate.trim(),
                    channelName,
                    uid,
                    Role.ROLE_PUBLISHER,
                    tokenExpirationInSeconds,
                    privilegeExpirationInSeconds
            );

            Map<String, Object> resp = new HashMap<>();
            resp.put("token", token);
            resp.put("appId", appId.trim());
            resp.put("channelName", channelName);
            resp.put("uid", uid);

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Token generation failed: " + e.getMessage());
        }
    }
}
