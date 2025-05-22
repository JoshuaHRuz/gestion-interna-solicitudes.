# Etapa 1: Construcción de la aplicación Angular
# Usamos Node.js 18 para la construcción de la aplicación Angular.
FROM node:18 AS build

# Establecemos el directorio de trabajo dentro del contenedor
# Esto simula la estructura de tu repositorio donde 'solicitudes-app' es la raíz del proyecto Angular.
WORKDIR /app/frontend/solicitudes-app

# Copiamos solo package.json y package-lock.json primero.
# Esto permite a Docker usar el caché de la capa si las dependencias no han cambiado,
# acelerando las reconstrucciones.
# Las rutas son relativas al contexto de construcción (la raíz de tu repositorio).
COPY frontend/solicitudes-app/package.json ./
COPY frontend/solicitudes-app/package-lock.json ./

# Instalamos todas las dependencias de Node.js.
RUN npm install

# Copiamos el resto de los archivos de la aplicación Angular.
# Esto incluye el código fuente, configuración, etc.
COPY frontend/solicitudes-app/ ./

# Construimos la aplicación Angular para producción.
# El comando 'npm run build -- --configuration production' compila la aplicación.
# La salida de esta construcción se encontrará en el directorio 'dist/solicitudes-app/browser/'
# dentro de este WORKDIR (/app/frontend/solicitudes-app/dist/solicitudes-app/browser/).
RUN npm run build -- --configuration production

# Etapa 2: Servir la aplicación con Nginx
# Usamos una imagen ligera de Nginx para servir los archivos estáticos.
FROM nginx:alpine

# Copiamos los archivos de la aplicación Angular ya construidos desde la etapa 'build'.
# La ruta de origen debe coincidir exactamente con la ubicación de salida de tu build en la etapa anterior.
# Estos archivos se copiarán al directorio por defecto de Nginx para servir contenido web.
COPY --from=build /app/frontend/solicitudes-app/dist/solicitudes-app/browser /usr/share/nginx/html

# Copiamos tu archivo de configuración personalizado de Nginx.
# Asegúrate de que 'nginx.conf' esté en la raíz de tu repositorio de Git.
# Este archivo es crucial para el enrutamiento de Single Page Applications (SPA) como Angular.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80, que es el puerto por defecto que Nginx escuchará.
EXPOSE 80

# Comando para iniciar Nginx en primer plano.
# 'daemon off;' asegura que Nginx se ejecute en primer plano, lo cual es necesario en Docker.
CMD ["nginx", "-g", "daemon off;"]
