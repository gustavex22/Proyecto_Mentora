import { useState, useEffect, useRef } from 'react';
import api from '../../Api/axios';
import { imageUrl } from '../../utils';
import './Perfil.css';

export function Perfil() {
  const [nombre, setNombre] = useState('');
  const [biografia, setBiografia] = useState('');
  const [redesSociales, setRedesSociales] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => {
        const u = res.data.data;
        setNombre(u.nombre || '');
        setBiografia(u.biografia || '');
        setRedesSociales(Array.isArray(u.redes_sociales) ? u.redes_sociales.join('\n') : '');
        setFotoUrl(u.foto || '');
      })
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar perfil'));
  }, []);

  const handleFotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo - aceptar solo mime types correctos (image/jpg no existe, es image/jpeg)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato no permitido. Usa JPG, PNG, WEBP o GIF.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen excede 2MB.');
      return;
    }

    setSubiendoFoto(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('foto', file);

    try {
      const res = await api.post('/uploads/profile-photo', formData);
      setFotoUrl(res.data.url);
      setMessage('Foto actualizada correctamente.');
    } catch (err) {
      console.error('Error al subir foto:', err);
      setError(err.response?.data?.message || 'Error al subir foto. Verifica el formato y tamaño.');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const redesArray = redesSociales
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.put('/auth/profile', {
        nombre,
        biografia,
        foto: fotoUrl,
        redes_sociales: redesArray
      });

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.nombre = nombre;
      user.foto = fotoUrl;
      user.biografia = biografia;
      user.redes_sociales = redesArray;
      localStorage.setItem('user', JSON.stringify(user));

      setMessage('Perfil actualizado correctamente.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perfil-page">
      <div className="perfil-card">
        <div className="perfil-photo-section">
          <div className="perfil-photo-wrapper">
            {fotoUrl ? (
              <img src={imageUrl(fotoUrl)} alt="Perfil" className="perfil-photo" />
            ) : (
              <div className="perfil-photo-placeholder">
                {nombre ? nombre.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFotoUpload}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="perfil-btn-secondary"
            onClick={() => fileRef.current?.click()}
            disabled={subiendoFoto}
          >
            {subiendoFoto ? 'Subiendo...' : 'Cambiar foto'}
          </button>
        </div>

        {message && <div className="perfil-success">{message}</div>}
        {error && <div className="perfil-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="perfil-form-group">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>

          <div className="perfil-form-group">
            <label htmlFor="biografia">Biografia</label>
            <textarea id="biografia" rows={4} value={biografia} onChange={(e) => setBiografia(e.target.value)} />
          </div>

          <div className="perfil-form-group">
            <label htmlFor="redes">Redes sociales (una por linea)</label>
            <textarea id="redes" rows={3} placeholder="https://twitter.com/usuario&#10;https://github.com/usuario" value={redesSociales} onChange={(e) => setRedesSociales(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}