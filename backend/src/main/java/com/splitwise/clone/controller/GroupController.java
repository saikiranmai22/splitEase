package com.splitwise.clone.controller;

import com.splitwise.clone.dto.CreateGroupRequest;
import com.splitwise.clone.dto.GroupResponse;
import com.splitwise.clone.dto.UserResponse;
import com.splitwise.clone.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {
    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(@Valid @RequestBody CreateGroupRequest request) {
        return ResponseEntity.ok(groupService.createGroup(request));
    }

    @PostMapping("/join")
    public ResponseEntity<Void> joinGroup(@RequestBody Map<String, String> payload) {
        groupService.joinGroup(payload.get("inviteToken"), UUID.fromString(payload.get("userId")));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GroupResponse>> getUserGroups(@PathVariable UUID userId) {
        return ResponseEntity.ok(groupService.getUserGroups(userId));
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<UserResponse>> getGroupMembers(@PathVariable UUID groupId) {
        return ResponseEntity.ok(groupService.getGroupMembers(groupId));
    }
}
