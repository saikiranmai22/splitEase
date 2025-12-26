package com.splitwise.clone.service;

import com.splitwise.clone.dto.CreateGroupRequest;
import com.splitwise.clone.dto.GroupResponse;
import com.splitwise.clone.dto.UserResponse;
import com.splitwise.clone.entity.Group;
import com.splitwise.clone.entity.GroupMember;
import com.splitwise.clone.entity.User;
import com.splitwise.clone.repository.GroupMemberRepository;
import com.splitwise.clone.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {
        private final GroupRepository groupRepository;
        private final GroupMemberRepository groupMemberRepository;
        private final UserService userService;

        @Transactional
        public GroupResponse createGroup(CreateGroupRequest request) {
                User creator = userService.findById(request.getCreatedBy());

                Group group = Group.builder()
                                .name(request.getName())
                                .createdBy(creator)
                                .inviteToken(UUID.randomUUID().toString())
                                .build();

                group = groupRepository.save(group);

                // Add creator as first member
                GroupMember creatorMember = GroupMember.builder()
                                .group(group)
                                .user(creator)
                                .build();
                groupMemberRepository.save(creatorMember);

                // Add initial members if any
                if (request.getInitialMembers() != null) {
                        for (UUID memberId : request.getInitialMembers()) {
                                if (memberId.equals(request.getCreatedBy()))
                                        continue; // Skip creator as already added
                                User friend = userService.findById(memberId);
                                GroupMember friendMember = GroupMember.builder()
                                                .group(group)
                                                .user(friend)
                                                .build();
                                groupMemberRepository.save(friendMember);
                        }
                }

                return mapToResponse(group);
        }

        @Transactional
        public void joinGroup(String inviteToken, UUID userId) {
                Group group = groupRepository.findByInviteToken(inviteToken)
                                .orElseThrow(() -> new RuntimeException("Invalid invite token"));
                User user = userService.findById(userId);

                if (groupMemberRepository.existsByGroupAndUser(group, user)) {
                        throw new RuntimeException("User already in group");
                }

                GroupMember member = GroupMember.builder()
                                .group(group)
                                .user(user)
                                .build();
                groupMemberRepository.save(member);
        }

        public List<GroupResponse> getUserGroups(UUID userId) {
                User user = userService.findById(userId);
                return groupMemberRepository.findByUser(user).stream()
                                .map(member -> mapToResponse(member.getGroup()))
                                .collect(Collectors.toList());
        }

        public Group findById(UUID id) {
                return groupRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Group not found"));
        }

        private GroupResponse mapToResponse(Group group) {
                return GroupResponse.builder()
                                .id(group.getId())
                                .name(group.getName())
                                .inviteToken(group.getInviteToken())
                                .createdBy(group.getCreatedBy().getId())
                                .createdAt(group.getCreatedAt())
                                .build();
        }

        public List<UserResponse> getGroupMembers(UUID groupId) {
                return groupMemberRepository.findByGroupId(groupId).stream()
                                .map(member -> UserResponse.builder()
                                                .id(member.getUser().getId())
                                                .name(member.getUser().getName())
                                                .email(member.getUser().getEmail())
                                                .build())
                                .toList();
        }
}
