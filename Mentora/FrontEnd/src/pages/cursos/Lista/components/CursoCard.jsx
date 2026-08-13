import { Link } from 'react-router-dom';
import { imageUrl } from '../../../../utils';

export function CursoCard({ curso }) {
  return (
    <Link to={`/cursos/${curso._id}`} className="lista-card">
      {curso.imagen ? (
        <img src={imageUrl(curso.imagen)} alt={curso.titulo} className="lista-card-img" />
      ) : (
        <div className="lista-card-img-placeholder">{'?'}</div>
      )}
      <div className="lista-card-body">
        <h3>{curso.titulo}</h3>
        <div className="lista-card-meta">
          <span>{curso.categoria || 'Sin categoria'}</span>
          <span>{curso.nivel || 'Sin nivel'}</span>
        </div>
        <span className={`lista-card-precio ${curso.precio === 0 ? 'gratis' : ''}`}>
          {curso.precio === 0 ? 'Gratis' : `$${curso.precio ?? 0}`}
        </span>
        {curso.calificacion_promedio > 0 && (
          <span style={{ fontSize: 13, color: '#f59e0b', display: 'block', marginTop: 4 }}>
            {'★'} {curso.calificacion_promedio}
          </span>
        )}
      </div>
    </Link>
  );
}
