# 🔐 API de Autenticación - Guía de Uso

## 📦 Instalación

Primero instala las dependencias:
```bash
cd Backend
yarn install
```

## ⚙️ Configuración

1. Crea un archivo `.env` en la carpeta Backend:
```
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
NODE_ENV=development
PORT=5000
```

## 🚀 Endpoints

### 1️⃣ REGISTRO - `POST /api/v1/auth/register`

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "password": "contraseña123",
  "passwordConfirm": "contraseña123"
}
```

**Response (201 - Éxito):**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "6123abc456def789",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "rol": "estudiante"
  }
}
```

**Errores:**
- `400` - Faltan campos o contraseñas no coinciden
- `400` - Email ya registrado
- `400` - Contraseña menor a 6 caracteres

---

### 2️⃣ LOGIN - `POST /api/v1/auth/login`

**Request:**
```json
{
  "correo": "juan@example.com",
  "password": "contraseña123"
}
```

**Response (200 - Éxito):**
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "6123abc456def789",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "rol": "estudiante"
  }
}
```

**Errores:**
- `401` - Email o contraseña incorrectos
- `401` - Usuario inactivo

---

## 🔒 Usar Token en Rutas Protegidas

El token se envía en el header `Authorization`:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ejemplo en JavaScript (Fetch):
```js
const token = localStorage.getItem('token'); // Guardaste el token del login

const response = await fetch('http://localhost:5000/api/v1/usuarios/perfil', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
```

### Ejemplo en Axios:
```js
import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

api.get('/usuarios/perfil').then(res => console.log(res.data));
```

---

## 📝 Proteger una Ruta

En tu controller/router, simplemente agrega el middleware `verificarToken`:

```js
const { verificarToken } = require("../middlewares/autenticacion");

// Ruta protegida
api.get("/usuarios/perfil", verificarToken, UsuariosController.getPerfil);

// En el controlador, accedes al ID del usuario:
async function getPerfil(req, res) {
  const usuarioId = req.usuarioId; // ID del usuario autenticado
  // ... resto del código
}
```

---

## 🧪 Pruebas con Postman

### REGISTER
- Método: `POST`
- URL: `http://localhost:5000/api/v1/auth/register`
- Body (JSON):
```json
{
  "nombre": "Carlos",
  "correo": "carlos@example.com",
  "password": "pass123456",
  "passwordConfirm": "pass123456"
}
```

### LOGIN
- Método: `POST`
- URL: `http://localhost:5000/api/v1/auth/login`
- Body (JSON):
```json
{
  "correo": "carlos@example.com",
  "password": "pass123456"
}
```

### Ruta Protegida (ejemplo)
- Método: `GET`
- URL: `http://localhost:5000/api/v1/usuarios/perfil`
- Header: `Authorization: Bearer <token_del_login>`

---

## ✅ Checklist

- [x] Sistema de registro con validaciones
- [x] Sistema de login con JWT
- [x] Contraseñas encriptadas con bcrypt
- [x] Middleware de protección
- [x] Roles de usuario (estudiante/instructor)
- [x] Verificación de email duplicado
- [x] Tokens con expiración (7 días)

¡Listo para usar! 🚀
