package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.PaymentService;
import com.razorpay.RazorpayException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    @Autowired private PaymentService paymentService;
    @Autowired private UserRepository userRepository;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            Authentication auth,
            @RequestParam Long mentorId,
            @RequestParam Long slotId) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body("Authentication required");
            }

            String email = auth.getName();
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }

            Map<String, Object> response = paymentService.createOrder(
                    user.getId(), mentorId, slotId);
            return ResponseEntity.ok(response);

        } catch (RazorpayException e) {
            return ResponseEntity.status(500)
                    .body("Payment gateway error: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Payment error");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            Authentication auth,
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature,
            @RequestParam Long mentorId,
            @RequestParam Long slotId) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body("Authentication required");
            }

            String email = auth.getName();
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }

            Map<String, Object> result = paymentService.verifyAndBook(
                    razorpayOrderId, razorpayPaymentId,
                    razorpaySignature, user.getId(), mentorId, slotId);
            return ResponseEntity.ok(result);

        } catch (RazorpayException e) {
            return ResponseEntity.status(400)
                    .body("Payment verification failed");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (Exception e) {
            log.error("Verify payment failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Verification error");
        }
    }
}
