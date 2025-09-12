# 1. Imagen base
FROM node:20-alpine


# 2. Directorio de trabajo dentro del contenedor
WORKDIR /

# 3. Copiar package.json y package-lock.json
COPY package*.json ./

# 4. Instalar dependencias
RUN npm ci --force

# 5. Copiar el resto del proyecto
COPY . .

# 6. Construir el proyecto 
RUN npm run build

# 7. Exponer el puerto del microservicio (ejemplo productos 3001)
EXPOSE 3001

# 8. Comando para iniciar el microservicio
CMD ["node", "dist/main.js"]