import { useState } from 'react';
import './Login.css'


export function Login() {
  // 1. FUNCIONALIDAD: Estados para capturar las variables del Backend
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // 2. Controlador del envío del formulario (Aquí disparas el Endpoint)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que recargue la página

    // Este es el DTO u Objeto que espera recibir tu controlador en Node/Spring Boot
    const loginData = {
      email: email,
      password: password
    };

    console.log("Enviando estos datos al backend:", loginData);
    
    try {
      // Aquí harías: const respuesta = await loginUsuario(loginData);
      // localStorage.setItem('token', respuesta.token);
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  // 3. TU DISEÑO: Tu HTML adaptado 100% a JSX (Solo lo que va en el body)
  return (
    <>
      <div className="geometric-background">
        <div className="triangle tri-1"></div>
        <div className="triangle tri-2"></div>
        <div className="triangle tri-3"></div>
        <div className="triangle tri-4"></div>
        <div className="triangle tri-5"></div>
        <div className="triangle tri-6"></div>
        <div className="triangle tri-7"></div>
        <div className="triangle tri-8"></div>
      </div>

      <main className="login-wrapper">
        <div className="glass-card">
          <h1 className="login-title">Login</h1>

          {/* Vinculamos el formulario con la función handleSubmit de arriba */}
          <form className="login-form" onSubmit={handleSubmit}>
            
            <div className="input-container">
              <input 
                type="email" 
                placeholder="E-mail" 
                required 
                className="round-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Captura el correo
              />
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
            </div>

            <div className="input-container">
              <input 
                type="password" 
                placeholder="Password" 
                required 
                className="round-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Captura la contraseña
              />
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password</a>
            </div>

            <button type="submit" class="btn-primary-round">Login</button>
          </form>

          <div className="social-section">
            <p className="social-title">Login With :</p>
            <div className="social-icons">
              <button className="social-btn-round" aria-label="Google">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.35 11.1H12.13v2.92h5.26c-.23 1.47-1.33 3.08-3.26 3.08-1.96 0-3.56-1.61-3.56-3.6s1.6-3.6 3.56-3.6c1.12 0 1.87.48 2.3.9l1.99-1.92C16.9 5.4 15.25 4.7 13 4.7c-4.24 0-7.7 3.47-7.7 7.7s3.46 7.7 7.7 7.7c4.43 0 7.37-3.11 7.37-7.5 0-.5-.05-.92-.12-1.25z" />
                </svg>
              </button>
              <button className="social-btn-round" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </button>
              <button className="social-btn-round" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 19 19" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="signup-redirect">
            Don't Have Account ? <a href="register.html">Sign Up Here!</a>
          </div>
        </div>
      </main>
    </>
  );
}