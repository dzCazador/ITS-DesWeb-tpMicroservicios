# 1. Imagen base
FROM node:20.19-alpine

# 2. Directorio de trabajo
WORKDIR /

# 3. Copiar package.json y package-lock.json
COPY package*.json ./

# 4. Instalar dependencias necesarias
RUN npm ci --force

# 5. Copiar el resto del código
COPY . .

# 6. Generar Prisma Client
RUN npx prisma generate

# 7. Compilar el proyecto
RUN npm run build

# 8. Exponer el puerto del microservicio de usuarios
EXPOSE 3001

# 9. Comando de inicio
CMD ["node", "dist/main.js"]