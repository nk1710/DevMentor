package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private static final Path UPLOAD_ROOT = Paths.get("uploads").toAbsolutePath().normalize();
    private static final Set<String> ALLOWED_TYPES = Set.of("resume", "profile");
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type) {

        try {
            String cleanType = type == null ? "" : type.trim().toLowerCase();
            String contentType = file.getContentType();
            if (file.isEmpty()
                    || !ALLOWED_TYPES.contains(cleanType)
                    || contentType == null
                    || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid file upload");
                return ResponseEntity.badRequest().body(error);
            }

            String originalName = Paths.get(file.getOriginalFilename() == null
                    ? "upload"
                    : file.getOriginalFilename()).getFileName().toString();
            String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");

            File dir = UPLOAD_ROOT.resolve(cleanType).toFile();
            if (!dir.exists()) dir.mkdirs();

            String fileName = UUID.randomUUID() + "_" + safeName;
            Path path = UPLOAD_ROOT.resolve(cleanType).resolve(fileName).normalize();
            if (!path.startsWith(UPLOAD_ROOT)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid file path");
                return ResponseEntity.badRequest().body(error);
            }

            Files.write(path, file.getBytes());

            Map<String, String> response = new HashMap<>();
            response.put("url", "/api/files/" + cleanType + "/" + fileName);
            response.put("fileName", fileName);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Upload failed");
            return ResponseEntity.badRequest().body(error);
        }
    }
}
