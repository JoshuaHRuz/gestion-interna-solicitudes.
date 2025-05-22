
# Guía de Inicio Rápido: Ejecutar el Proyecto Localmente

¡Hola! Esta guía te ayudará a poner en marcha la aplicación Angular de este proyecto en tu máquina local. Sigue estos sencillos pasos para clonar el repositorio, instalar las dependencias y ejecutar la aplicación.

## 1. Requisitos Previos

Antes de que puedas empezar, asegúrate de tener lo siguiente instalado en tu sistema:

- **Git**: Necesitarás Git para clonar el repositorio. Si no lo tienes, descárgalo desde [git-scm.com](https://git-scm.com/).
- **Node.js y npm**: La aplicación Angular funciona con Node.js y su gestor de paquetes npm. Te recomendamos usar la versión **18.19.1 o superior** de Node.js.

  Puedes descargar el instalador LTS (Long Term Support) desde [nodejs.org/es/download](https://nodejs.org/es/download/).

  Verifica tus versiones abriendo tu terminal y ejecutando:

  ```bash
  node -v
  npm -v
  ```

- **Angular CLI**: Esta herramienta de línea de comandos es esencial para construir y servir aplicaciones Angular. Si aún no la tienes instalada globalmente, hazlo con:

  ```bash
  npm install -g @angular/cli
  ```

## 2. Clonar el Repositorio

Primero, descarga una copia del código del proyecto a tu computadora desde GitHub.

Abre tu terminal (o línea de comandos) y ejecuta el siguiente comando:

```bash
git clone https://github.com/JoshuaHRuz/gestion-interna-solicitudes.git
```

Esto creará una nueva carpeta llamada `gestion-interna-solicitudes` en el directorio donde ejecutaste el comando.

## 3. Navegar al Directorio del Frontend

Este proyecto tiene una estructura que separa el frontend (Angular) del backend. La parte de Angular se encuentra en una subcarpeta específica, y debemos movernos allí para trabajar con ella.

```bash
cd gestion-interna-solicitudes/frontend/solicitudes-app
```

Ahora, tu terminal estará dentro del directorio principal de la aplicación Angular.

## 4. Instalar las Dependencias

Una vez que estés en el directorio `solicitudes-app`, es hora de instalar todas las librerías y módulos que el proyecto necesita.

```bash
npm install
```

Verás cómo npm descarga e instala los paquetes. Es normal ver algunas advertencias sobre dependencias obsoletas; por lo general, no afectan la funcionalidad del proyecto.

## 5. Instalar Angular Material

Angular Material proporciona componentes UI listos para usar que siguen las directrices de Material Design. Para instalarlo, ejecuta:

```bash
ng add @angular/material
```

Sigue las instrucciones que aparecen en consola para configurar el tema y animaciones según tus preferencias.

## 6. Iniciar la Aplicación Angular

¡Casi listo! Con todas las dependencias instaladas, puedes iniciar el servidor de desarrollo de Angular.

```bash
ng serve --open
```

Esto compilará tu aplicación y la abrirá automáticamente en tu navegador, generalmente en [http://localhost:4200](http://localhost:4200/).

## 7. Ver la Aplicación en el Navegador

Cuando el servidor esté corriendo, deberías poder acceder a la aplicación en:

```
http://localhost:4200/
```

## 8. Detener el Servidor de Desarrollo

Para detener el servidor cuando ya no necesites tener la aplicación corriendo, presiona `Ctrl + C` en la terminal donde lo iniciaste.

## 9. Reinstalar Dependencias (si es necesario)

Si en algún momento tienes problemas con las dependencias, puedes eliminar la carpeta `node_modules` y el archivo `package-lock.json`, y luego ejecutar:

```bash
npm install
```


---
¡Eso es todo! Ahora deberías tener la aplicación Angular funcionando correctamente en tu entorno local.
```
