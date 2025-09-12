# Base image
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la app (por si usás TypeScript compilado)
RUN npm run build

# Expone el puerto por el que escucha (según tu MS_FACTURA_PORT)
EXPOSE 3002

# Comando para ejecutar el microservicio
CMD ["node", "dist/main.js"]