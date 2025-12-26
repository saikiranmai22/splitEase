package com.splitwise.clone.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CreateGroupRequest {
    @NotBlank(message = "Group name is required")
    private String name;

    private List<UUID> initialMembers;

    private UUID createdBy;
}
