package com.example.gestionsolicitudes.mapper;

import com.example.gestionsolicitudes.domain.RequestHistoryEntry;
import com.example.gestionsolicitudes.domain.User;
import com.example.gestionsolicitudes.dto.RequestHistoryEntryViewDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", uses = {RequestMapper.class}) // `uses` no es necesario aquí pero es útil si hay mappers anidados
public interface RequestHistoryEntryMapper {

    @Mapping(source = "user", target = "userEmail", qualifiedByName = "userToEmailForHistory")
    RequestHistoryEntryViewDTO historyEntryToHistoryEntryViewDTO(RequestHistoryEntry entry);

    List<RequestHistoryEntryViewDTO> historyEntriesToHistoryEntryViewDTOs(List<RequestHistoryEntry> entries);

    // Método calificador (puede ser el mismo que en RequestMapper o uno específico)
    @Named("userToEmailForHistory")
    default String userToEmail(User user) {
        return user != null ? user.getEmail() : null;
    }
} 