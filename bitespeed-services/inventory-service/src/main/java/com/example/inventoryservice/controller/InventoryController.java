package com.example.inventoryservice.controller;

import com.example.inventoryservice.entity.Inventory;
import com.example.inventoryservice.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<Inventory> getAllItems() {
        return inventoryService.getAllItems();
    }

    @PostMapping
    public Inventory addItem(@RequestBody @org.springframework.lang.NonNull Inventory item) {
        return inventoryService.addItem(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateItem(@PathVariable("id") @org.springframework.lang.NonNull String id, @RequestBody Inventory item) {
        return inventoryService.updateItem(id, item)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public String deleteItem(@PathVariable("id") @org.springframework.lang.NonNull String id) {
        return inventoryService.deleteItem(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getItemById(@PathVariable("id") @org.springframework.lang.NonNull String id) {
        return inventoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
