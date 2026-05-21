package com.example.inventoryservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    @Id
    private String id;
    private String name;
    private int quantity;
    private String status; // Available, Borrowed, Damaged, Missing
    private double price;
    private String category;
    private String description;
    private String imageUrl;
}
