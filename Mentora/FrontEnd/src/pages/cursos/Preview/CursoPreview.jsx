import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import api from '../../../Api/axios';
import { imageUrl } from '../../../utils';
import { ComentariosCurso } from '../shared/ComentariosCurso';
import { useResenas } from '../shared/useResenas';
import './CursoPreview.css';

export function CursoPreview() {
  const { id } = useParams();
  const { user } = useAuth();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState('');
  const [seccionAbierta, setSeccionAbierta] = useState(0);
  const { resenas, loading: resenasLoading, crearComentario, calificar, actualizarResena, eliminarResena } = useResenas(id);

  const cargarCurso = useCallback(() => {
    return api.get(`/Cursos/${id}`)
      .then((res) => setCurso(res.data?.curso || res.data?.data?.curso));
  }, [id]);

  useEffect(() => {
    cargarCurso()
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar curso'))
      .finally(() => setLoading(false));
  }, [cargarCurso]);

  useEffect(() => {
    if (!user || !curso || user.rol !== 'estudiante') return;
    api.get('/Inscripciones/mis-cursos')
      .then((res) => {
        const inscripciones = res.data?.inscripciones || [];
        setEnrolled(inscripciones.some((insc) => insc.curso_id?._id === id));
      })
      .catch(console.error);
  }, [id, user, curso]);

  const handleCalificar = async (calificacion) => {
    await calificar(calificacion);
    await cargarCurso();
  };

  const handleInscribir = async () => {
    setEnrolling(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/Inscripciones', { curso_id: id });
      if (res.data.requiere_pago) {
        setMessage('Redirigiendo al pago...');
        await api.post('/Inscripciones/pagar', { curso_id: id });
        setEnrolled(true);
        setMessage('Inscripcion exitosa!');
      } else {
        setEnrolled(true);
        setMessage('Inscripcion exitosa!');
      }
    } catch (err) {
      if (err.response?.data?.message?.includes('Ya estas inscrito')) {
        setEnrolled(true);
        setMessage('Ya estas inscrito.');
      } else {
        setError(err.response?.data?.message || 'Error al inscribirse');
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="dash-loading">Cargando curso...</div>;
  if (error) return <div className="dash-error">{error}</div>;
  if (!curso) return <div className="dash-error">Curso no encontrado</div>;

  const totalReviewers = new Set(resenas.map((r) => r.estudiante_id?._id).filter(Boolean)).size;
  const totalLecciones = curso.secciones?.reduce((sum, s) => sum + (s.lecciones?.length || 0), 0) || 0;
  const instructor = curso.instructorID;

  return (
    <div>
      <div className="curso-preview">
        <div className="curso-preview-header">
          <h1>{curso.titulo}</h1>
          <div className="curso-preview-meta">
            <span>{curso.categoria}</span>
            <span>{curso.nivel}</span>
            {curso.calificacion_promedio > 0 && (
              <span style={{ color: '#f59e0b' }}>{'★'} {curso.calificacion_promedio}</span>
            )}
          </div>
        </div>
        <div className="curso-preview-body">
          <div className="curso-preview-info">
            <div className="curso-preview-desc">
              <h2>Descripcion</h2>
              <p>{curso.descripcion || 'Sin descripcion.'}</p>
            </div>
          </div>
          <div className="curso-preview-sidebar">
            <div className={`curso-preview-price ${curso.precio === 0 ? 'gratis' : ''}`}>
              {curso.precio === 0 ? 'Gratis' : `$${curso.precio ?? 0}`}
            </div>

            {instructor && (
              <Link to={`/instructores/${instructor._id}`} className="curso-preview-instructor">
                {instructor.foto ? (
                  <img src={imageUrl(instructor.foto)} alt="Instructor" />
                ) : (
                  <div className="perfil-photo-placeholder" style={{ width: 40, height: 40, fontSize: 18 }}>
                    {instructor?.nombre?.charAt(0) || '?'}
                  </div>
                )}
                <span>{instructor?.nombre || 'Sin nombre'}</span>
              </Link>
            )}

            <div className="curso-preview-stats">
              <div className="stat-row">
                <span className="stat-value">{curso.total_inscritos || 0}</span>
                <span className="stat-label">Estudiantes</span>
              </div>
              <div className="stat-row">
                <span className="stat-value stat-stars">
                  {'★'} {curso.calificacion_promedio > 0 ? curso.calificacion_promedio : '0.0'}
                </span>
                <span className="stat-label">Calificacion</span>
              </div>
              <div className="stat-row">
                <span className="stat-value">{totalReviewers}</span>
                <span className="stat-label">Resenas</span>
              </div>
              <div className="stat-row">
                <span className="stat-value">{totalLecciones}</span>
                <span className="stat-label">Lecciones</span>
              </div>
            </div>

            {user?.rol === 'estudiante' && !enrolled && (
              <button className="preview-btn-inscribir" onClick={handleInscribir} disabled={enrolling}>
                {enrolling ? 'Inscribiendo...' : 'Inscribirse'}
              </button>
            )}
            {enrolled && (
              <Link
                to={`/cursos/${id}/aprender`}
                className="preview-btn-inscribir"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
              >
                Ir al curso
              </Link>
            )}
            {message && <div style={{ marginTop: 12, fontSize: 14, color: '#059669' }}>{message}</div>}
            {error && <div style={{ marginTop: 12, fontSize: 14, color: '#ef4444' }}>{error}</div>}
          </div>
        </div>
      </div>

      {curso.secciones?.length > 0 && (
        <div className="preview-temario">
          <h2>Temario</h2>
          {curso.secciones.map((seccion, i) => (
            <div key={seccion._id} className="seccion-item">
              <div className="preview-seccion-header" onClick={() => setSeccionAbierta(seccionAbierta === i ? -1 : i)}>
                <span>Seccion {i + 1}: {seccion.titulo}</span>
                <span>{seccionAbierta === i ? '▲' : '▼'}</span>
              </div>
              {seccionAbierta === i && seccion.lecciones?.map((leccion) => (
                <div key={leccion._id} className="preview-leccion-item">
                  <span className="leccion-icon">{'▶'}</span>
                  <span>{leccion.titulo}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <ComentariosCurso
        resenas={resenas}
        loading={resenasLoading}
        user={user}
        enrolled={enrolled}
        promedio={curso.calificacion_promedio || 0}
        onComentar={crearComentario}
        onCalificar={handleCalificar}
        onActualizar={actualizarResena}
        onEliminar={eliminarResena}
      />
    </div>
  );
}
