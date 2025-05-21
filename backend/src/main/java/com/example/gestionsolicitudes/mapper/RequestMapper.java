package com.example.gestionsolicitudes.mapper;

import com.example.gestionsolicitudes.domain.Request;
import com.example.gestionsolicitudes.domain.User;
import com.example.gestionsolicitudes.dto.RequestCreateDTO;
import com.example.gestionsolicitudes.dto.RequestUpdateDTO;
import com.example.gestionsolicitudes.dto.RequestViewDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring") // Para que Spring pueda inyectarlo
public interface RequestMapper {

    // De Entidad a RequestViewDTO
    @Mapping(source = "requester", target = "requesterEmail", qualifiedByName = "userToEmail")
    @Mapping(source = "assignedTo", target = "assignedToEmail", qualifiedByName = "userToEmail")
    RequestViewDTO requestToRequestViewDTO(Request request);

    List<RequestViewDTO> requestsToRequestViewDTOs(List<Request> requests);

    // De RequestCreateDTO a Entidad Request
    // Nota: requester y assignedTo se manejarán en el servicio
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "history", ignore = true)
    @Mapping(target = "requester", ignore = true) // Se establece en el servicio
    @Mapping(target = "assignedTo", ignore = true) // Se establece en el servicio si assignedToId está presente
    Request requestCreateDTOToRequest(RequestCreateDTO dto);

    // De RequestUpdateDTO a Entidad Request (para actualizar campos)
    // Se podrían necesitar más configuraciones aquí si se quiere un merge selectivo
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "history", ignore = true)
    @Mapping(target = "requester", ignore = true)
    @Mapping(target = "assignedTo", ignore = true) // Se establece en el servicio si assignedToId está presente
    Request requestUpdateDTOToRequest(RequestUpdateDTO dto);

    // Método calificador para convertir User a email String
    @Named("userToEmail")
    default String userToEmail(User user) {
        return user != null ? user.getEmail() : null;
    }
} 