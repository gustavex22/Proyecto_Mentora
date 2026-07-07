import api from "../Api/axios"

// Esta es la const async que maneja el endpoint
export const loginUsuario = async (datosDeLogin) => {
  try {
    // Hacemos el POST al endpoint '/auth/login' (se une a la baseURL)
    // 'datosDeLogin' es el objeto que lleva el correo y contraseña
    const respuesta = await api.post('/auth/login', datosDeLogin);
    
    // Tu backend probablemente devuelve un objeto con el Token (JWT) y datos del usuario
    // Todo eso viene dentro de 'respuesta.data'
    return respuesta.data; 

  } catch (error) {
    // Si el backend responde con un error (ej: 400 datos incorrectos), cae aquí
    console.error("Error en el login:", error.response?.data || error.message);
    throw error; // Reenviamos el error para que el componente React sepa que falló
  }
};