package com.example.demo.config;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Order(1)
public class RateLimitingFilter implements Filter {

    private final Map<String, RateLimitEntry> requestCounts = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS = 20;
    private static final long WINDOW_MS = 60_000;

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    @PostConstruct
    public void init() {
        scheduler.scheduleAtFixedRate(() -> {
            long now = System.currentTimeMillis();
            Iterator<Map.Entry<String, RateLimitEntry>> it = requestCounts.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry<String, RateLimitEntry> entry = it.next();
                if (now - entry.getValue().windowStart > WINDOW_MS * 2) {
                    it.remove();
                }
            }
        }, 5, 5, TimeUnit.MINUTES);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI();

        if (path.contains("/login") || path.contains("/register")
                || path.contains("/bookings/create") || path.contains("/payments")
                || path.contains("/files/upload")) {
            String ip = httpRequest.getHeader("X-Forwarded-For");
            if (ip == null || ip.isEmpty()) {
                ip = httpRequest.getRemoteAddr();
            } else {
                ip = ip.split(",")[0].trim();
            }
            String key = ip + ":" + path;

            RateLimitEntry entry = requestCounts.computeIfAbsent(key, k -> new RateLimitEntry());
            long now = System.currentTimeMillis();

            synchronized (entry) {
                if (now - entry.windowStart > WINDOW_MS) {
                    entry.windowStart = now;
                    entry.count.set(1);
                } else if (entry.count.incrementAndGet() > MAX_REQUESTS) {
                    HttpServletResponse httpResponse = (HttpServletResponse) response;
                    httpResponse.setStatus(429);
                    httpResponse.getWriter().write("Too many requests. Please try again later.");
                    return;
                }
            }
        }

        chain.doFilter(request, response);
    }

    private static class RateLimitEntry {
        long windowStart = System.currentTimeMillis();
        AtomicInteger count = new AtomicInteger(1);
    }
}