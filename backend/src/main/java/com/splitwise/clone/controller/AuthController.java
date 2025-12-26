package com.splitwise.clone.controller;

import com.splitwise.clone.dto.UserRequest;
import com.splitwise.clone.dto.UserResponse;
import com.splitwise.clone.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody Map<String, String> credentials) {
        return ResponseEntity.ok(userService.login(credentials.get("email"), credentials.get("password")));
    }
}
