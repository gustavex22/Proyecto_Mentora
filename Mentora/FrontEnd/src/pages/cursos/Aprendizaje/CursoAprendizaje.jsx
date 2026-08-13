import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../Api/axios';
import { useAuth } from '../../../context/useAuth';
import { getEmbedUrl } from '../../../utils';
import { TemarioSeccion } from './components/TemarioSeccion';
import { ComentariosCurso } from '../shared/ComentariosCurso';
import { useResenas } from '../shared/useResenas';
import './CursoAprendizaje.css';

export function CursoAprendizaje() {
  const { id } = useParams();
  const { user } = useAuth();
  const [curso, setCurso] = useState(null);
  const [inscripcion, setInscripcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seccionAbierta, setSeccionAbierta] = useState(0);
  const [leccionActual, setLeccionActual] = useState(null);
  const { resenas, loading: resenasLoading, crearComentario, calificar, actualizarResena, eliminarResena } = useResenas(id);

  useEffect(() => {
    Promise.all([api.get(`/Cursos/${id}`), api.get('/Inscripciones/mis-cursos')])
      .then(([cRes, iRes]) => {
        const cursoData = cRes.data.curso || cRes.data.data?.curso;
        setCurso(cursoData);
        const inscs = iRes.data.inscripciones || [];
        const miInsc = inscs.find((i) => i.curso_id?._id === id || i.curso_id === id);
        if (miInsc) setInscripcion(miInsc);
        else setError('No estas inscrito en este curso.');
        if (cursoData?.secciones?.[0]?.lecciones?.[0]) {
          setLeccionActual(cursoData.secciones[0].lecciones[0]);
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar'))
      .finally(() => setLoading(false));
  }, [id]);

  const marcarLeccion = async (inscripcionId, leccionId) => {
    try {
      const res = await api.patch(`/Inscripciones/${inscripcionId}/lecciones/${leccionId}`);
      const updated = res.data.inscripcion;
      setInscripcion((prev) => ({ ...prev, progreso: updated.progreso, porcentaje: updated.porcentaje }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCalificar = async (calificacion) => {
    await calificar(calificacion);
    try {
      const res = await api.get(`/Cursos/${id}`);
      setCurso(res.data?.curso || res.data?.data?.curso);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="dash-loading">Cargando curso...</div>;
  if (error) return <div className="dash-error">{error}</div>;
  if (!curso) return <div className="dash-error">Curso no encontrado</div>;

  const progresoMap = {};
  if (inscripcion?.progreso) {
    inscripcion.progreso.forEach((p) => { progresoMap[p.leccion_id?._id || p.leccion_id] = p.completada; });
  }

  const totalLecciones = curso.secciones?.reduce((sum, s) => sum + (s.lecciones?.length || 0), 0) || 0;
  const completadas = Object.values(progresoMap).filter(Boolean).length;
  const embedUrl = leccionActual?.url ? getEmbedUrl(leccionActual.url) : null;

  return (
    <div className="curso-aprendizaje-page">
      <div className="curso-aprendizaje-header">
        <h1 className="curso-aprendizaje-title">{curso.titulo}</h1>
        <div className="curso-aprendizaje-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${inscripcion?.porcentaje || 0}%` }} />
          </div>
          <span>{inscripcion?.porcentaje || 0}%</span>
          <span>{completadas}/{totalLecciones} lecciones</span>
        </div>
      </div>

      <div className="aprendizaje-grid">
        <div className="aprendizaje-player-column">
          {leccionActual ? (
            <>
              <div className="aprendizaje-player-wrapper">
                {embedUrl ? (
                  <iframe
                    className="aprendizaje-player-frame"
                    src={embedUrl}
                    title={leccionActual.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="aprendizaje-player-empty">
                    Esta leccion no tiene video asociado.
                  </div>
                )}
              </div>
              <div className="aprendizaje-leccion-info">
                <h2 className="aprendizaje-leccion-titulo">{leccionActual.titulo}</h2>
                {leccionActual.descripcion && <p className="aprendizaje-leccion-desc">{leccionActual.descripcion}</p>}
                {leccionActual.duracion > 0 && <span className="aprendizaje-leccion-duracion">{leccionActual.duracion} min</span>}
              </div>
            </>
          ) : (
            <div className="aprendizaje-player-empty">
              Selecciona una leccion del temario para reproducirla.
            </div>
          )}

          <ComentariosCurso
            resenas={resenas}
            loading={resenasLoading}
            user={user}
            enrolled={!!inscripcion}
            promedio={curso.calificacion_promedio || 0}
            onComentar={crearComentario}
            onCalificar={handleCalificar}
            onActualizar={actualizarResena}
            onEliminar={eliminarResena}
          />
        </div>

        <aside className="aprendizaje-temario-column">
          <h2 className="aprendizaje-temario-title">Temario</h2>
          {curso.secciones?.length > 0 ? (
            <div className="aprendizaje-temario">
              {curso.secciones.map((seccion, i) => (
                <TemarioSeccion
                  key={seccion._id}
                  seccion={seccion}
                  abierta={seccionAbierta === i}
                  onToggle={() => setSeccionAbierta(seccionAbierta === i ? -1 : i)}
                  onMarcarLeccion={marcarLeccion}
                  onSelectLeccion={setLeccionActual}
                  inscripcionId={inscripcion._id}
                  progresoMap={progresoMap}
                  leccionActualId={leccionActual?._id}
                />
              ))}
            </div>
          ) : (
            <p className="aprendizaje-empty-message">Este curso no tiene contenido aun.</p>
          )}
        </aside>
      </div>
    </div>
  );
}