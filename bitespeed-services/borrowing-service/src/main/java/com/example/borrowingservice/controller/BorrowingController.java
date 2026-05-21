package com.example.borrowingservice.controller;

import com.example.borrowingservice.entity.Borrowing;
import com.example.borrowingservice.service.BorrowingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/borrowing")
public class BorrowingController {
    private final BorrowingService borrowingService;

    public BorrowingController(BorrowingService borrowingService) {
        this.borrowingService = borrowingService;
    }

    @PostMapping("/borrow")
    public ResponseEntity<Borrowing> borrowItem(@RequestBody Borrowing borrowing) {
        try {
            return ResponseEntity.ok(borrowingService.borrowItem(borrowing));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/return/{id}")
    public ResponseEntity<Borrowing> returnItem(@PathVariable("id") @org.springframework.lang.NonNull Long id) {
        try {
            return ResponseEntity.ok(borrowingService.returnItem(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/history")
    public List<Borrowing> getHistory() {
        return borrowingService.getAllBorrowings();
    }
}
