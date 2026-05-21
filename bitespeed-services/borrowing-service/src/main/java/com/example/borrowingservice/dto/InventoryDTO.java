package com.example.borrowingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDTO {
    private String id;
    private String name;
    private int quantity;
    private String status;
    private double price;
    private String category;
    private String description;
    private String imageUrl;
}
