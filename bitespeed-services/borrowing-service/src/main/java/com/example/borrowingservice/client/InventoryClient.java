package com.example.borrowingservice.client;

import com.example.borrowingservice.dto.InventoryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "inventory-service", path = "/api/inventory")
public interface InventoryClient {
    @GetMapping("/{id}")
    InventoryDTO getItemById(@PathVariable("id") String id);

    @PutMapping("/{id}")
    void updateItem(@PathVariable("id") String id, @RequestBody InventoryDTO item);
}
