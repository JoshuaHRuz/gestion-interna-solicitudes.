# Etapa 1: Construcción de la aplicación Angular
FROM node:18 AS build
WORKDIR /app

# Copiar solo package.json y package-lock.json primero para aprovechar el caché de Docker
COPY frontend/solicitudes-app/package.json frontend/solicitudes-app/package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación Angular
COPY frontend/solicitudes-app/ ./

# Construir la aplicación para producción
# La salida estará en /app/dist/solicitudes-app/browser/
RUN npm run build -- --configuration production

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar los archivos de la aplicación Angular construidos desde la etapa de construcción
COPY --from=build /app/dist/solicitudes-app/browser /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 (el puerto por defecto de Nginx)
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"] 