import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  // Clonar la solicitud con los headers necesarios
  let modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    withCredentials: true
  });

  // Si hay un token, añadirlo al header
  if (token) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        ...modifiedReq.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  return next(modifiedReq);
}; 