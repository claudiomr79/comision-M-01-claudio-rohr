# Dockerfile para el Backend de la Plataforma Interactiva de Viajes

# --- Etapa de Base ---
# Utilizar una imagen oficial de Node.js. Alpine es una buena opción por su tamaño reducido.
# Se recomienda usar una versión LTS específica en lugar de 'latest' para mayor estabilidad.
FROM node:18-alpine AS base

# Establecer el directorio de trabajo dentro del contenedor.
WORKDIR /usr/src/app/backend

# Copiar package.json y package-lock.json (o yarn.lock) antes que el resto del código.
# Esto aprovecha el sistema de caché de Docker; si estos archivos no cambian,
# Docker no reinstalará las dependencias en cada build.
COPY package*.json ./

# --- Etapa de Dependencias ---
# Instalar dependencias de producción.
# Si tienes scripts de build o necesitas devDependencies para compilar algo (ej. TypeScript a JS),
# entonces no uses --production aquí y considera una etapa de build separada.
RUN npm install --production

# --- Etapa de Producción ---
# Copiar el resto del código de la aplicación.
COPY . .

# El puerto en el que la aplicación backend escuchará.
# Este valor debería ser el mismo que se configura en settings/envs.js y se pasa como variable de entorno.
# Docker Compose se encargará de mapear este puerto a un puerto en el host.
# No es necesario usar EXPOSE ${PORT} directamente aquí si el puerto es fijo o se maneja por envs.js,
# pero es una buena práctica documentarlo. Se asume que envs.js usa process.env.PORT.
# El valor real se pasará a través de docker-compose.yml.
# EXPOSE 4000 (si el puerto es 4000 por defecto o en envs.js)
# Dejaremos que la variable de entorno PORT defina esto en el docker-compose.yml

# Comando para iniciar la aplicación.
# Asegúrate de que app.js (o tu archivo principal) esté en la raíz del WORKDIR
# o ajusta la ruta.
CMD [ "node", "app.js" ]

# Comentarios Adicionales:
# - Variables de Entorno: Configura MONGO_URI, JWT_SECRET, PORT, etc., a través de docker-compose.yml
#   o pasándolas al ejecutar `docker run`. No las hardcodees en el Dockerfile.
# - Seguridad: Considera ejecutar la aplicación con un usuario no root por seguridad.
#   Ejemplo:
#   RUN addgroup -S appgroup && adduser -S appuser -G appgroup
#   USER appuser
#   (Esto requeriría ajustar permisos de archivos si es necesario).
# - Hot Reloading en Desarrollo: Para desarrollo, usualmente se usan volúmenes para montar el código fuente
#   directamente en el contenedor y herramientas como nodemon para reiniciar automáticamente la aplicación
#   cuando hay cambios. Este Dockerfile está más orientado a producción.
#   El docker-compose.yml puede manejar la configuración de desarrollo.
