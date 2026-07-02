package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    @Value("${razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:}")
    private String razorpayKeySecret;

    @Autowired private PaymentRepository paymentRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private SlotRepository slotRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private MentorRepository mentorRepository;

    @Transactional
    public Map<String, Object> createOrder(Long userId, Long mentorId, Long slotId) throws RazorpayException {
        if (razorpayKeyId == null || razorpayKeyId.isEmpty()
                || razorpayKeySecret == null || razorpayKeySecret.isEmpty()) {
            log.error("Razorpay keys not configured");
            throw new IllegalStateException("Payment gateway not configured");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) throw new IllegalArgumentException("User not found");

        Mentor mentor = mentorRepository.findById(mentorId).orElse(null);
        if (mentor == null || mentor.getPricePerHour() == null) {
            throw new IllegalArgumentException("Invalid mentor or pricing");
        }

        Slot slot = slotRepository.findByIdWithMentor(slotId).orElse(null);
        if (slot == null) throw new IllegalArgumentException("Slot not found");

        if (slot.isBooked()) throw new IllegalArgumentException("Slot is already booked");

        if (!slot.getMentor().getId().equals(mentorId)) {
            throw new IllegalArgumentException("Slot does not belong to this mentor");
        }

        int baseAmount = (int) Math.round(mentor.getPricePerHour() * 100);
        if (baseAmount <= 0) throw new IllegalArgumentException("Invalid payment amount");

        int gst = (int) Math.round(baseAmount * 0.18);
        int totalAmount = baseAmount + gst;

        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        org.json.JSONObject orderRequest = new org.json.JSONObject();
        orderRequest.put("amount", totalAmount);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        com.razorpay.Order order = razorpay.orders.create(orderRequest);

        Payment payment = new Payment();
        payment.setRazorpayOrderId(order.get("id"));
        payment.setAmount(totalAmount);
        payment.setCurrency("INR");
        payment.setStatus("CREATED");
        payment.setUser(user);
        payment.setMentor(mentor);
        payment.setSlot(slot);
        paymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("amount", totalAmount);
        response.put("currency", "INR");
        response.put("keyId", razorpayKeyId);
        return response;
    }

    @Transactional
    public Map<String, Object> verifyAndBook(
            String razorpayOrderId, String razorpayPaymentId,
            String razorpaySignature, Long userId,
            Long mentorId, Long slotId) throws RazorpayException {

        org.json.JSONObject attributesJson = new org.json.JSONObject();
        attributesJson.put("razorpay_order_id", razorpayOrderId);
        attributesJson.put("razorpay_payment_id", razorpayPaymentId);
        attributesJson.put("razorpay_signature", razorpaySignature);

        boolean isValid = Utils.verifyPaymentSignature(attributesJson, razorpayKeySecret);
        if (!isValid) throw new IllegalArgumentException("Payment signature verification failed");

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Payment record not found"));

        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        payment.setStatus("CAPTURED");
        paymentRepository.save(payment);

        User user = userRepository.findById(userId).orElse(null);
        Mentor mentor = mentorRepository.findById(mentorId).orElse(null);
        Slot slot = slotRepository.findByIdWithMentor(slotId).orElse(null);

        if (user == null || mentor == null || slot == null) {
            throw new IllegalArgumentException("User, mentor, or slot not found");
        }
        if (slot.isBooked()) {
            throw new IllegalArgumentException("Slot already booked");
        }
        if (!slot.getMentor().getId().equals(mentorId)) {
            throw new IllegalArgumentException("Slot does not belong to this mentor");
        }

        try {
            slot.setBooked(true);
            slotRepository.save(slot);
        } catch (ObjectOptimisticLockingFailureException e) {
            log.error("Optimistic lock failure for slot {} - attempting refund", slotId);
            refundPayment(razorpayPaymentId);
            throw new IllegalStateException("Slot was just booked by someone else. Payment has been refunded.");
        } catch (Exception e) {
            log.error("Booking failed for slot {}: {}", slotId, e.getMessage(), e);
            throw e;
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setMentor(mentor);
        booking.setSlot(slot);
        booking.setStatus("CONFIRMED");
        booking.setRoomId("dm-" + UUID.randomUUID().toString().substring(0, 12));
        booking.setPaymentId(razorpayPaymentId);
        booking.setAmountPaid(payment.getAmount());
        Booking saved = bookingRepository.save(booking);

        mentor.setTotalSessions(
            (mentor.getTotalSessions() == null ? 0 : mentor.getTotalSessions()) + 1
        );
        mentorRepository.save(mentor);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("bookingId", saved.getId());
        response.put("paymentId", razorpayPaymentId);
        response.put("amount", payment.getAmount());
        return response;
    }

    public void refundPayment(String razorpayPaymentId) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            org.json.JSONObject refundRequest = new org.json.JSONObject();
            refundRequest.put("payment_id", razorpayPaymentId);
            razorpay.payments.refund(refundRequest);

            Payment payment = paymentRepository.findByRazorpayPaymentId(razorpayPaymentId).orElse(null);
            if (payment != null) {
                payment.setStatus("REFUNDED");
                paymentRepository.save(payment);
            }
            log.info("Refund initiated for payment: {}", razorpayPaymentId);
        } catch (RazorpayException e) {
            log.error("Refund failed for payment {}: {}", razorpayPaymentId, e.getMessage());
        }
    }
}
