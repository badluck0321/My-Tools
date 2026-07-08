package com.example.BackEnd_MyTools.Controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.BackEnd_MyTools.DTO.DtoCreateDemande;
import com.example.BackEnd_MyTools.DTO.DtoGetDemande;
import com.example.BackEnd_MyTools.Entitys.RoleRequest;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.RoleRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/role-requests")
@RequiredArgsConstructor
public class RoleRequestController {
    private final RoleRequestService roleRequestService;

    /** Authenticated user submits a request to become a Store Owner or Craftsman. */
    @PostMapping
    public ResponseEntity<RoleRequest> submit(@RequestBody DtoCreateDemande request,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(roleRequestService.submit(jwt, request));
    }

    /** The current user's latest request. */
    @GetMapping("/mine")
    public ResponseEntity<DtoGetDemande> mine(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(roleRequestService.toDto(roleRequestService.mine(SecurityUtils.currentUserId(jwt))));
    }

    /** The current user's full request history. */
    @GetMapping("/mine/history")
    public ResponseEntity<List<DtoGetDemande>> mineHistory(@AuthenticationPrincipal Jwt jwt) {
        List<DtoGetDemande> dtos = roleRequestService.mineHistory(SecurityUtils.currentUserId(jwt)).stream()
                .map(roleRequestService::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /** Admin: list pending requests. */
    @GetMapping("/pending")
    public ResponseEntity<List<DtoGetDemande>> pending(@AuthenticationPrincipal Jwt jwt) {
        List<DtoGetDemande> dtos = roleRequestService.pending(jwt).stream()
                .map(roleRequestService::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /** Admin: list all requests. */
    @GetMapping
    public ResponseEntity<List<DtoGetDemande>> all(@AuthenticationPrincipal Jwt jwt) {
        List<DtoGetDemande> dtos = roleRequestService.all(jwt).stream()
                .map(roleRequestService::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /** Admin: approve or reject a request. */
    @PatchMapping("/{id}/review")
    public ResponseEntity<RoleRequest> review(@PathVariable String id,
            @RequestParam RoleRequest.RoleRequestStatus status,
            @RequestParam(required = false) String comment,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(roleRequestService.review(id, status, comment, jwt));
    }
}
