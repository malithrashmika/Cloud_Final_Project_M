package com.example.borrowingservice.service;

import com.example.borrowingservice.client.InventoryClient;
import com.example.borrowingservice.dto.InventoryDTO;
import com.example.borrowingservice.entity.Borrowing;
import com.example.borrowingservice.repository.BorrowingRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowingService {
    private final BorrowingRepository borrowingRepository;
    private final InventoryClient inventoryClient;

    public BorrowingService(BorrowingRepository borrowingRepository, InventoryClient inventoryClient) {
        this.borrowingRepository = borrowingRepository;
        this.inventoryClient = inventoryClient;
    }

    public Borrowing borrowItem(Borrowing borrowing) {
        InventoryDTO item = inventoryClient.getItemById(borrowing.getItemId());
        if (item != null && item.getQuantity() > 0) {
            // Update inventory quantity
            item.setQuantity(item.getQuantity() - 1);
            if (item.getQuantity() == 0) {
                item.setStatus("Borrowed");
            }
            inventoryClient.updateItem(item.getId(), item);

            // Save borrowing record
            borrowing.setBorrowDate(LocalDate.now());
            borrowing.setStatus("Active");
            return borrowingRepository.save(borrowing);
        }
        throw new RuntimeException("Item not available for borrowing");
    }

    public Borrowing returnItem(@org.springframework.lang.NonNull Long borrowingId) {
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new RuntimeException("Borrowing record not found"));
        
        if ("Returned".equals(borrowing.getStatus())) {
            throw new RuntimeException("Item already returned");
        }

        InventoryDTO item = inventoryClient.getItemById(borrowing.getItemId());
        if (item != null) {
            item.setQuantity(item.getQuantity() + 1);
            item.setStatus("Available");
            inventoryClient.updateItem(item.getId(), item);
        }

        borrowing.setReturnDate(LocalDate.now());
        borrowing.setStatus("Returned");
        return borrowingRepository.save(borrowing);
    }

    public List<Borrowing> getAllBorrowings() {
        return borrowingRepository.findAll();
    }
}
