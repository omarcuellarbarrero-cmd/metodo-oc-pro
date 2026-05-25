# Usamos una imagen limpia y liviana de Node.js
FROM node:18-alpine

# Definimos el directorio de trabajo en el servidor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos los módulos de Node de forma limpia
RUN npm install --production

# Copiamos todo el proyecto al contenedor
COPY . .

# Abrimos el puerto estándar de comunicación
EXPOSE 3000

# EL CAMBIO AQUÍ: Arrancamos el motor apuntando al nuevo archivo de la raíz
CMD ["node", "cerebro.js"]
