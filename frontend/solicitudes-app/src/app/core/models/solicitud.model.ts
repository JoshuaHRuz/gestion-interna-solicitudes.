// src/app/core/models/solicitud.model.ts

// Interfaz base para una solicitud en la lista
export interface Solicitud {
  id: number;
  tipo: string; // O el nombre del tipo de solicitud
  asunto: string;
  fechaCreacion: string; // Consideraré usar Date en el futuro para manejo de fechas
  fechaMaxima?: string; // Opcional
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Devuelta' | string; // Añadí 'string' para flexibilidad, pero un enum sería mejor
}

// Interfaz para el detalle completo de la solicitud
export interface SolicitudDetalle extends Solicitud {
  descripcion: string;
  urgente: boolean;
  historialAprobacion: AprobacionPaso[];
  // Aquí podría añadir cualquier otro campo específico del detalle, como adjuntos, etc.
}

// Interfaz para un paso en el historial de aprobación
export interface AprobacionPaso {
  etapa: string;
  responsable: string;
  fechaAccion: string; // O Date
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Devuelto' | string;
  comentarios?: string;
}

// Interfaz para los tipos de solicitud (para el dropdown)
export interface TipoSolicitud {
  id: number;
  nombre: string;
  descripcion?: string;
  // Podría añadir aquí propiedades como 'requiereFechaMaxima', 'etapasPorDefecto'
}