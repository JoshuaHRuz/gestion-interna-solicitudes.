package com.example.gestionsolicitudes.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Lob
    @Column(nullable = false, columnDefinition="TEXT")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private DepartmentType department;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private RequestStatus status;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private RequestPriority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Lob
    @Column(columnDefinition="TEXT")
    private String comments;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RequestHistoryEntry> history = new ArrayList<>();

    // Método de ayuda para agregar entradas al historial (bidireccional)
    public void addHistoryEntry(RequestHistoryEntry entry) {
        history.add(entry);
        entry.setRequest(this);
    }

    public void removeHistoryEntry(RequestHistoryEntry entry) {
        history.remove(entry);
        entry.setRequest(null);
    }
} 