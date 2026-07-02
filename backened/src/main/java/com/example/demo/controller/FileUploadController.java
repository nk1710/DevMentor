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
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "jpg", "jpeg", "png", "webp");

    private boolean validateMagicBytes(byte[] bytes, String contentType) {
        if (bytes.length < 4) return false;
        if ("application/pdf".equals(contentType)) {
            return bytes[0] == 0x25 && bytes[1] == 0x50 && bytes[2] == 0x44 && bytes[3] == 0x46;
        }
        if ("image/jpeg".equals(contentType)) {
            return bytes[0] == (byte) 0xFF && bytes[1] == (byte) 0xD8 && bytes[2] == (byte) 0xFF;
        }
        if ("image/png".equals(contentType)) {
            return bytes[0] == (byte) 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47;
        }
        if ("image/webp".equals(contentType)) {
            return bytes[0] == 0x52 && bytes[1] == 0x49 && bytes[2] == 0x46 && bytes[3] == 0x46;
        }
        return false;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type) {

        try {
            String cleanType = type == null ? "" : type.trim().toLowerCase();
            String contentType = file.getContentType();

            if (file.isEmpty()) {
                return error("File is empty");
            }

            if (file.getSize() > MAX_FILE_SIZE) {
                return error("File size exceeds maximum allowed size (5MB)");
            }

            if (!ALLOWED_TYPES.contains(cleanType)) {
                return error("Invalid upload type: " + cleanType);
            }

            if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
                return error("Invalid file type: " + contentType);
            }

            String originalName = file.getOriginalFilename();
            if (originalName != null) {
                String ext = originalName.contains(".") ?
                    originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase() : "";
                if (!ALLOWED_EXTENSIONS.contains(ext)) {
                    return error("Invalid file extension: " + ext);
                }
            }

            byte[] fileBytes = file.getBytes();
            if (!validateMagicBytes(fileBytes, contentType)) {
                return error("File content does not match declared type");
            }

            String safeName = (originalName == null ? "upload" : originalName)
                .replaceAll("[^a-zA-Z0-9._-]", "_");

            File dir = UPLOAD_ROOT.resolve(cleanType).toFile();
            if (!dir.exists()) dir.mkdirs();

            String fileName = UUID.randomUUID() + "_" + safeName;
            Path path = UPLOAD_ROOT.resolve(cleanType).resolve(fileName).normalize();
            if (!path.startsWith(UPLOAD_ROOT)) {
                return error("Invalid file path");
            }

            Files.write(path, file.getBytes());

            Map<String, String> response = new HashMap<>();
            response.put("url", "/api/files/" + cleanType + "/" + fileName);
            response.put("fileName", fileName);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return error("Upload failed");
        }
    }

    private ResponseEntity<Map<String, String>> error(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.badRequest().body(error);
    }
}