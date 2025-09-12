# 1. Imagen base
FROM node:20.19-alpine

# 2. Directorio de trabajo
WORKDIR /

# 3. Copiar package.json y package-lock.json
COPY package*.json ./

# 4. Instalar dependencias necesarias
RUN npm install -g @nestjs/cli
RUN npm ci --force

# 5. Copiar el resto del código
COPY . .

# 6. Compilar el proyecto (sin Prisma)
RUN npm run build

# 7. Exponer el puerto del gateway
EXPOSE 3000

# 8. Comando de inicio
CMD ["node", "dist/main.js"]