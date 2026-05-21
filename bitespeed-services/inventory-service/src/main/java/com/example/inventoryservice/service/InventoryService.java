package com.example.inventoryservice.service;

import com.example.inventoryservice.entity.Inventory;
import com.example.inventoryservice.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<Inventory> getAllItems() {
        return inventoryRepository.findAll();
    }

    public Inventory addItem(@org.springframework.lang.NonNull Inventory item) {
        if (item.getId() != null && item.getId().trim().isEmpty()) {
            item.setId(null);
        }
        return inventoryRepository.save(item);
    }

    public String deleteItem(@org.springframework.lang.NonNull String id) {
        inventoryRepository.deleteById(id);
        return "Item removed with id: " + id;
    }

    public Optional<Inventory> updateItem(@org.springframework.lang.NonNull String id, Inventory itemDetails) {
        return inventoryRepository.findById(id).map(existingItem -> {
            existingItem.setName(itemDetails.getName());
            existingItem.setQuantity(itemDetails.getQuantity());
            existingItem.setStatus(itemDetails.getStatus());
            existingItem.setPrice(itemDetails.getPrice());
            existingItem.setCategory(itemDetails.getCategory());
            existingItem.setDescription(itemDetails.getDescription());
            existingItem.setImageUrl(itemDetails.getImageUrl());
            return inventoryRepository.save(existingItem);
        });
    }

    public Optional<Inventory> findById(@org.springframework.lang.NonNull String id) {
        return inventoryRepository.findById(id);
    }
}
