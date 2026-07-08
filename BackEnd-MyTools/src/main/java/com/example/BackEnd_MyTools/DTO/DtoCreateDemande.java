package com.example.BackEnd_MyTools.DTO;

import com.example.BackEnd_MyTools.Entitys.RoleRequest;

import lombok.Data;

@Data
public class DtoCreateDemande {
    private RoleRequest.RoleRequestType type;
    private String description;
}
