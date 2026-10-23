package com.example.demo.controller;

import com.example.demo.entity.Booking;
import com.example.demo.entity.Mentor;
import com.example.demo.entity.Slot;
import com.example.demo.repository.MentorRepository;
import com.example.demo.repository.SlotRepository;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private BookingService bookingService;

    @Value("${razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestParam Long mentorId,
            @RequestParam Long slotId) {

        Mentor mentor = mentorRepository.findById(mentorId).orElse(null);
        Slot slot = slotRepository.findById(slotId).orElse(null);

        if (mentor == null || slot == null) {
            return ResponseEntity.badRequest().body("Mentor or slot not found");
        }
        if (slot.isBooked()) {
            return ResponseEntity.badRequest().body("Slot is already booked");
        }

        double pricePerHour = mentor.getPricePerHour() != null ? mentor.getPricePerHour() : 0.0;
        long amountInPaise = Math.round(pricePerHour * 100);

        String orderId = null;

        // Call Razorpay API to create official order if keys are set
        if (razorpayKeyId != null && !razorpayKeyId.trim().isEmpty() 
            && razorpayKeySecret != null && !razorpayKeySecret.trim().isEmpty()) {
            try {
                String auth = Base64.getEncoder().encodeToString(
                    (razorpayKeyId.trim() + ":" + razorpayKeySecret.trim()).getBytes(StandardCharsets.UTF_8)
                );

                String payload = String.format("{\"amount\":%d,\"currency\":\"INR\",\"receipt\":\"rcpt_%d\"}", amountInPaise, slotId);

                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/orders"))
                    .header("Authorization", "Basic " + auth)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

                HttpResponse<String> resp = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
                if (resp.statusCode() == 200) {
                    Matcher m = Pattern.compile("\"id\"\\s*:\\s*\"(order_[^\"]+)\"").matcher(resp.body());
                    if (m.find()) {
                        orderId = m.group(1);
                        System.out.println(">>> Razorpay order created successfully: " + orderId);
                    }
                } else {
                    System.out.println(">>> Razorpay order API returned status " + resp.statusCode() + ": " + resp.body());
                }
            } catch (Exception e) {
                System.out.println(">>> Razorpay order creation exception: " + e.getMessage());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("amount", amountInPaise);
        response.put("currency", "INR");
        response.put("keyId", razorpayKeyId);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyAndBook(
            @RequestParam Long userId,
            @RequestParam Long mentorId,
            @RequestParam Long slotId,
            @RequestParam(required = false) String paymentId,
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) String signature) {

        System.out.println("=== Verifying payment: paymentId=" + paymentId + " orderId=" + orderId + " userId=" + userId);

        if (razorpayKeySecret != null && !razorpayKeySecret.trim().isEmpty() 
            && signature != null && !signature.trim().isEmpty() 
            && orderId != null && !orderId.trim().isEmpty() 
            && paymentId != null && !paymentId.trim().isEmpty()) {
            boolean valid = verifySignature(orderId, paymentId, signature, razorpayKeySecret.trim());
            if (!valid) {
                return ResponseEntity.badRequest().body("Payment verification failed: Invalid signature");
            }
        }

        Booking booking = bookingService.createBooking(userId, mentorId, slotId);
        if (booking == null) {
            return ResponseEntity.badRequest().body("Slot is already booked or mentor not found");
        }

        return ResponseEntity.ok(booking);
    }

    private boolean verifySignature(String orderId, String paymentId, String signature, String secret) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equalsIgnoreCase(signature);
        } catch (Exception e) {
            return false;
        }
    }
}
