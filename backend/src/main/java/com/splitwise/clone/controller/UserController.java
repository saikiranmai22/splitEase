package com.splitwise.clone.controller;

import com.splitwise.clone.dto.UserResponse;
import com.splitwise.clone.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}/friends")
    public ResponseEntity<List<UserResponse>> getFriends(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getFriends(userId));
    }
}
