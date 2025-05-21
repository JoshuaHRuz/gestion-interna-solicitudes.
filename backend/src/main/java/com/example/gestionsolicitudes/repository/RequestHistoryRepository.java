package com.example.gestionsolicitudes.repository;

import com.example.gestionsolicitudes.domain.Request;
import com.example.gestionsolicitudes.domain.RequestHistoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestHistoryRepository extends JpaRepository<RequestHistoryEntry, Long> {
    List<RequestHistoryEntry> findByRequestOrderByTimestampDesc(Request request);
} 