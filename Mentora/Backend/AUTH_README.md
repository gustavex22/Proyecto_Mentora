# Autenticación JWT - Documentación

## Configuración

El sistema de autenticación JWT ha sido implementado con una duración de sesión de **8 horas**.

### Variables de Entorno (Opcional)

Puedes configurar las siguientes variables de entorno en un archivo `.env`:

```
JWT_SECRET=tu_secreto_muy_seguro_personalizado
PORT=3977
```

Si no se define `JWT_SECRET`, se usará un valor por defecto.

## Endpoints de Autenticación

### 1. Login (POST)

**URL:** `/api/v1/login`

**Body:**

```json
{
  "correo": "usuario@ejemplo.com",
  "password": "tu_contraseña"
}
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "usuario": {
      "_id": "...",
      "nombre": "Nombre del Usuario",
      "correo": "usuario@ejemplo.com",
      "rol": "estudiante",
      "biografia": "",
      "foto": null,
      "activo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "8h"
  }
}
```

### 2. Obtener Usuario Actual (GET) - Protegido

**URL:** `/api/v1/me`

**Headers:**

```
Authorization: Bearer <tu_token_jwt>
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "nombre": "Nombre del Usuario",
    "correo": "usuario@ejemplo.com",
    "rol": "estudiante",
    ...
  }
}
```

### 3. Renovar Token (POST) - Protegido

**URL:** `/api/v1/refresh-token`

**Headers:**

```
Authorization: Bearer <tu_token_jwt>
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Token renovado exitosamente",
  "data": {
    "token": "nuevo_token_jwt_aqui...",
    "expiresIn": "8h"
  }
}
```

## Cómo Usar en el Frontend

### Ejemplo con Fetch API:

```javascript
// 1. Login
async function login(correo, password) {
  const response = await fetch("http://localhost:3977/api/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, password }),
  });

  const data = await response.json();

  if (data.success) {
    // Guardar token en localStorage o sessionStorage
    localStorage.setItem("token", data.data.token);
    return data.data;
  }

  throw new Error(data.message);
}

// 2. Hacer requests protegidas
async function obtenerUsuarioActual() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3977/api/v1/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

// 3. Cerrar sesión
function logout() {
  localStorage.removeItem("token");
  // Redirigir al login
}
```

### Ejemplo con Axios:

```javascript
import axios from "axios";

// Configurar interceptor para agregar token automáticamente
const api = axios.create({
  baseURL: "http://localhost:3977/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Uso
await api.post("/login", { correo, password });
const usuario = await api.get("/me");
```

## Consideraciones de Seguridad

1. **Duración del Token:** Los tokens expiran después de 8 horas por defecto.

2. **Almacenamiento del Token:**
   - Para mayor seguridad, usa `sessionStorage` en lugar de `localStorage`
   - Considera usar cookies HttpOnly si es posible

3. **HTTPS:** En producción, siempre usa HTTPS para proteger los tokens en tránsito.

4. **Renovación de Token:** Implementa lógica en el frontend para renovar el token antes de que expire si el usuario sigue activo.

## Estructura de Archivos Creados

```
Backend/
├── controllers/
│   └── AuthController.js       # Controlador de autenticación
├── middlewares/
│   └── authMiddleware.js       # Middleware para verificar tokens
├── router/
│   └── Auth.js                 # Rutas de autenticación
├── app.js                      # Configuración actualizada
└── package.json                # Dependencia jsonwebtoken agregada
```

## Manejo de Errores

El sistema retorna los siguientes códigos de error:

- **400**: Datos inválidos o faltantes
- **401**: Credenciales inválidas o token expirado/inválido
- **403**: Usuario inactivo
- **404**: Usuario no encontrado
- **500**: Error del servidor
