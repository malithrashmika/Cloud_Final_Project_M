package com.example.borrowingservice.repository;

import com.example.borrowingservice.entity.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;


public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
    List<Borrowing> findByBorrowerName(String borrowerName);
}
