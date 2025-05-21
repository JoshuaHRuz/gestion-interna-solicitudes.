// src/app/services/requests.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Definición de la interfaz de una solicitud
export type Department = 'IT' | 'RRHH' | 'FINANZAS' | 'VENTAS' | 'ADMINISTRACION' | 'OPERACIONES';

// Definición de la interfaz de una solicitud (Actualizada con 'history')
export interface RequestHistoryEntry {
  timestamp: Date;
  action: string; // Ej: 'Creada', 'Estado cambiado a Aprobada', 'Editada', 'Comentario añadido'
  byUser: string; // ID del usuario que realizó la acción
  details?: string; // Detalles adicionales, como el estado anterior/nuevo
}

// Definición de la interfaz de una solicitud (Actualizada con 'history')
export interface Request {
  id: string;
  title: string;
  description: string;
  department: Department;
  status: 'Pendiente' | 'En Proceso' | 'Completada' | 'Rechazada' | 'Aprobada' | 'Devuelta';
  priority: 'Baja' | 'Media' | 'Alta';
  requesterId: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt?: Date;
  comments?: string;
  history?: RequestHistoryEntry[]; // NUEVA PROPIEDAD: Historial de interacciones
}

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private requests: Request[] = [
    { id: 'req001', title: 'Problema con impresora', description: 'La impresora de la oficina no funciona.', department: 'IT', status: 'Pendiente', priority: 'Alta', requesterId: 'empleado1', createdAt: new Date('2024-05-15T10:00:00Z') },
    { id: 'req002', title: 'Solicitud de vacaciones', description: 'Necesito solicitar vacaciones del 1 al 15 de julio.', department: 'RRHH', status: 'Completada', priority: 'Media', requesterId: 'empleado2', createdAt: new Date('2024-05-10T09:00:00Z') },
    { id: 'req003', title: 'Cambio de software contable', description: 'Necesitamos una licencia para el nuevo software.', department: 'FINANZAS', status: 'Pendiente', priority: 'Media', requesterId: 'empleado3', createdAt: new Date('2024-05-12T14:30:00Z') },
    { id: 'req004', title: 'Soporte para VPN', description: 'No puedo conectarme a la VPN desde casa.', department: 'IT', status: 'En Proceso', priority: 'Alta', requesterId: 'empleado4', createdAt: new Date('2024-05-16T11:00:00Z') },
    { id: 'req005', title: 'Alta de nuevo empleado', description: 'Incorporación de Juan Pérez en ventas.', department: 'RRHH', status: 'Pendiente', priority: 'Alta', requesterId: 'empleado5', createdAt: new Date('2024-05-17T09:00:00Z') },
    { id: 'req006', title: 'Actualización de hardware', description: 'Necesitamos renovar equipos en el área de diseño.', department: 'IT', status: 'Pendiente', priority: 'Media', requesterId: 'empleado6', createdAt: new Date('2024-05-18T16:00:00Z') },
    { id: 'req007', title: 'Consulta de nómina', description: 'Duda sobre mi última nómina.', department: 'RRHH', status: 'Completada', priority: 'Baja', requesterId: 'empleado7', createdAt: new Date('2024-05-14T10:00:00Z') },
    { id: 'req008', title: 'Revisión de presupuesto', description: 'Necesitamos revisión del presupuesto trimestral.', department: 'FINANZAS', status: 'Pendiente', priority: 'Alta', requesterId: 'empleado8', createdAt: new Date('2024-05-19T10:00:00Z') },
    { id: 'req009', title: 'Pedido de material de oficina', description: 'Faltan folios y bolígrafos.', department: 'ADMINISTRACION', status: 'Pendiente', priority: 'Baja', requesterId: 'empleado9', createdAt: new Date('2024-05-20T09:00:00Z') },
  ];

  constructor() { }

  // Obtener todas las solicitudes (para administrador o pruebas)
  getRequests(): Observable<Request[]> {
    return of(this.requests).pipe(delay(500));
  }

  // Obtener solicitudes por departamento (para supervisor)
  getRequestsByDepartment(department: Department): Observable<Request[]> {
    const filteredRequests = this.requests.filter(req => req.department === department);
    return of(filteredRequests).pipe(delay(500));
  }
  getRequestById(id: string): Observable<Request | undefined> {
    const request = this.requests.find(req => req.id === id);
    return of(request).pipe(delay(300));
  }
  // Actualizar el estado de una solicitud (ejemplo)
updateRequestStatus(id: string, newStatus: Request['status'], comments?: string, byUser?: string): Observable<Request> {
    const requestIndex = this.requests.findIndex(req => req.id === id);
    if (requestIndex > -1) {
      const updatedRequest = { ...this.requests[requestIndex] };
      const oldStatus = updatedRequest.status; // Guardar estado anterior

      updatedRequest.status = newStatus;
      updatedRequest.updatedAt = new Date();
      if (comments) {
        updatedRequest.comments = comments;
      }

      // Añadir al historial
      const historyEntry: RequestHistoryEntry = {
        timestamp: new Date(),
        action: `Estado cambiado de ${oldStatus} a ${newStatus}`,
        byUser: byUser || 'Desconocido', // Asegúrate de pasar el usuario actual
        details: comments || ''
      };
      updatedRequest.history = updatedRequest.history ? [...updatedRequest.history, historyEntry] : [historyEntry];

      this.requests[requestIndex] = updatedRequest;
      return of(updatedRequest).pipe(delay(500));
    }
    return new Observable(observer => {
      observer.error(new Error('Solicitud no encontrada para actualización.'));
    });
  }

  // NUEVO: Método para crear una solicitud (Admin)
  createRequest(newRequest: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'history'>, createdBy: string): Observable<Request> {
    const id = `req${(this.requests.length + 1).toString().padStart(3, '0')}`; // ID simple
    const requestWithDefaults: Request = {
      ...newRequest,
      id: id,
      createdAt: new Date(),
      status: 'Pendiente', // Las nuevas solicitudes inician como pendientes
      history: [{ timestamp: new Date(), action: 'Creada por Administrador', byUser: createdBy }]
    };
    this.requests.push(requestWithDefaults);
    return of(requestWithDefaults).pipe(delay(500));
  }

  // NUEVO: Método para actualizar TODOS los campos de una solicitud (Admin)
  editRequest(updatedRequest: Request, editedBy: string): Observable<Request> {
    const requestIndex = this.requests.findIndex(req => req.id === updatedRequest.id);
    if (requestIndex > -1) {
      const oldRequest = { ...this.requests[requestIndex] }; // Para historial

      updatedRequest.updatedAt = new Date();
      updatedRequest.history = updatedRequest.history || [];

      const historyEntry: RequestHistoryEntry = {
        timestamp: new Date(),
        action: 'Editada por Administrador',
        byUser: editedBy,
        details: this.getEditDifferences(oldRequest, updatedRequest) // Implementar esta función
      };
      updatedRequest.history.push(historyEntry);


      this.requests[requestIndex] = updatedRequest; // Reemplaza la solicitud existente
      return of(updatedRequest).pipe(delay(500));
    }
    return new Observable(observer => {
      observer.error(new Error('Solicitud no encontrada para edición.'));
    });
  }

  // NUEVO: Método para eliminar una solicitud (Admin)
  deleteRequest(id: string): Observable<boolean> {
    const initialLength = this.requests.length;
    this.requests = this.requests.filter(req => req.id !== id);
    if (this.requests.length < initialLength) {
      return of(true).pipe(delay(500)); // Eliminado con éxito
    }
    return new Observable(observer => {
      observer.error(new Error('Solicitud no encontrada para eliminación.'));
    });
  }

  // Función auxiliar para registrar diferencias en edición (simple, puedes expandirla)
  private getEditDifferences(oldReq: Request, newReq: Request): string {
    let diffs: string[] = [];
    if (oldReq.title !== newReq.title) diffs.push(`Título: '${oldReq.title}' -> '${newReq.title}'`);
    if (oldReq.description !== newReq.description) diffs.push(`Descripción: '${oldReq.description}' -> '${newReq.description}'`);
    if (oldReq.department !== newReq.department) diffs.push(`Departamento: '${oldReq.department}' -> '${newReq.department}'`);
    if (oldReq.status !== newReq.status) diffs.push(`Estado: '${oldReq.status}' -> '${newReq.status}'`);
    if (oldReq.priority !== newReq.priority) diffs.push(`Prioridad: '${oldReq.priority}' -> '${newReq.priority}'`);
    if (oldReq.requesterId !== newReq.requesterId) diffs.push(`Solicitante ID: '${oldReq.requesterId}' -> '${newReq.requesterId}'`);
    if (oldReq.assignedTo !== newReq.assignedTo) diffs.push(`Asignado a: '${oldReq.assignedTo || 'Nadie'}' -> '${newReq.assignedTo || 'Nadie'}'`);
    if (oldReq.comments !== newReq.comments) diffs.push(`Comentarios: '${oldReq.comments || 'Vacío'}' -> '${newReq.comments || 'Vacío'}'`);
    // Puedes añadir más comparaciones para otros campos
    return diffs.length > 0 ? diffs.join('; ') : 'No se detectaron cambios significativos en campos principales.';
  }

  // NUEVO: Método para obtener el historial de una solicitud
  getRequestHistory(requestId: string): Observable<RequestHistoryEntry[] | undefined> {
    const request = this.requests.find(req => req.id === requestId);
    if (request && request.history) {
      return of(request.history).pipe(delay(200));
    } else if (request && !request.history) {
      return of([]).pipe(delay(200)); // Si existe la solicitud pero no tiene historial
    }
    return of(undefined).pipe(delay(200)); // Si la solicitud no se encuentra
  }
}