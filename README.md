# ITS Desarrollo Web - Proyecto Final Microservicios

## 👥 Integrantes del Proyecto
- **Testaseca Cristian**
- **Caporaso Manuel**

Este es el trabajo práctico evaluativo de la materia **Desarrollo Web** de la **Tecnicatura en Desarrollo de Software** del **Instituto Técnico Superior Cipolletti**. 
El proyecto se desarrolló con una **arquitectura de microservicios**, donde cada servicio se levanta de manera independiente y se comunica con el **Gateway** para la autenticación y coordinación de datos.

Cada microservicio tiene su propia base de datos y ORM configurado según la necesidad:

- **Usuarios** → Prisma ORM con **PostgreSQL**  
- **Productos** → TypeORM con **MySQL**  
- **Facturas** → Prisma ORM con **MongoDB**

Se implementó autenticación con **JWT**, **Passport** y **Guards**, además de comunicación entre microservicios para operaciones como facturación, carritos de usuarios y gestión de stock.

---

## 📌 Requisitos previos

**Asegurarse de tener instalados:**

- [Node.js](https://nodejs.org) (versión 16 o superior)  
- [Git](https://git-scm.com/)  
- Sistemas gestores de bases de datos:  
  - **PostgreSQL** (para Usuarios)  
  - **MySQL** (para Productos)  
  - **MongoDB** (para Facturas)  
- [Docker](https://www.docker.com/) y Docker Compose (opcional, para levantar todo con contenedores)  

---

## ⚙️ Instalación y configuración (sin Docker)

Cada microservicio debe iniciarse **por separado** siguiendo los pasos:

1. **Clonar el repositorio**
   ```bash
   git clone <URL_REPOSITORIO>
   cd <CARPETA_DEL_PROYECTO>

2. **Ingresar en el microservicio deseado**  
   Ingresá al directorio del proyecto y ejecuta:  
   ```bash
    cd usuarios   # o productos / facturas / gateway
    ```
   
3. **Instalar las dependencias**  
   Ingresá al directorio del proyecto y ejecuta:  
   ```bash
   npm install
   ```

4. **Configurar las variables de entorno**  
   Creá un archivo `.env` en la raíz del proyecto basándote en el archivo `.env_template`.  
   Asegurate de reemplazar los valores con la configuración de tu base de datos.

5. **Migracion de bases de datos**  
   Aplicá la última versión de las migraciones con los siguiente comandos:

   *USUARIOS  
   ```bash
   npx prisma migrate dev --name <NOMBRE_MIGRACION> y luego
   npx prima generate
   ```
   
   *PRODUCTOS  
   ```bash
   Para inicializar la base de datos de productos, es necesario habilitar en el archivo de configuración de TypeORM
   synchronize: true
   Esto creará automáticamente las tablas al inicio.
   IMPORTANTE: una vez generadas, cambiarlo a:
   synchronize: false
   
   ```
   *FACTURAS  
   ```bash
   npx prisma migrate dev --name <NOMBRE_MIGRACION> y luego
   npx prima generate
   ```

7. **Iniciar cada microservicion**  
   Ejecutá el siguiente comando para iniciar la aplicación en modo desarrollo:  
   ```bash
   nest run start
   ```

## 🐳**Instalación y configuración (con Docker)**

Cada microservicio también está dockerizado. Para levantar todo el entorno:

**1.** Asegúrate de tener Docker y Docker Compose instalados.

**2.** En la raíz del proyecto, ejecutar:

   ```bash
   docker-compose up --build
   ```

**3.** Esto levantará los servicios:
Gateway
Users (PostgreSQL)
Products (MySQL)
Invoice (MongoDB)

**4.** Las variables de entorno están definidas en los archivos .env.template de cada microservicio y/o en docker-compose.yml.

## 📖 **Documentación**
Cada microservicio cuenta con documentación accesible de dos formas:

**Swagger** → Endpoints interactivos:

   Una vez que la aplicación esté en ejecución, abrí tu navegador y accede a:  
   ```
   http://localhost:3000/api
   ```
   Aca vas a encontrar la documentación interactiva generada con **Swagger**, que describe todas las rutas disponibles.
   
**Compodoc** → Documentación técnica del proyecto:
Generar con:
   ```
   npm run compodoc
  npm run compodoc:serve
   ```
## 🚀 **Funcionalidades principales**

Autenticación centralizada en el Gateway (JWT, Passport, Guards).

Comunicación entre microservicios (ejemplo: facturas enlazadas con usuarios).

Gestión de carritos reutilizando la entidad Factura (Invoice):
En lugar de crear una nueva entidad Cart, se utiliza la misma entidad Invoice, diferenciada por el campo status.
Cuando un usuario agrega productos, se genera una Invoice con status = "carrito".
Al finalizar la compra, el status cambia a "aprobada", convirtiéndose en una factura real.

Gestión de productos con stock y relación con usuarios mediante carritos/facturas.

CRUD básicos: creación, consulta, edición (sin eliminación física).

Buenas prácticas de programación (SOLID, manejo de errores).

Limpieza de carritos automática con node-cron si superan los 3 días de inactividad.

## 🛠️ **Tecnologías utilizadas**

**Node.js** - Entorno de ejecución

**NestJS** - Framework principal

**Prisma ORM** - Usuarios (PostgreSQL) y Facturas (MongoDB)

**TypeORM** - Productos (MySQL)

**Swagger** - Documentación de rutas

**Compodoc** - Documentación técnica

**JWT / Passport / Guards** - Autenticación y autorización

**Node-cron** - Automatización de limpieza de carritos

**Docker & Docker Compose** - Contenerización de servicios

