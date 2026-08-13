import { useState, useEffect } from 'react';
import api from '../../../Api/axios';
import { CursoCard } from './components/CursoCard';
import './CursosLista.css';

const CATEGORIAS = ['programacion', 'diseno', 'negocios', 'musica', 'fotografia', 'marketing', 'desarrollo'];
const NIVELES = ['', 'principiante', 'intermedio', 'avanzado'];

export function CursosLista() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ titulo: '', categoria: '', nivel: '' });

  useEffect(() => {
    const q = {};
    if (filters.titulo) q.titulo = filters.titulo;
    if (filters.categoria) q.categoria = filters.categoria;
    if (filters.nivel) q.nivel = filters.nivel;

    let cancelado = false;
    api.get('/Cursos', { params: q })
      .then((res) => { if (!cancelado) setCursos(res.data.cursos || res.data.data?.cursos || []); })
      .catch((err) => { if (!cancelado) setError(err.response?.data?.message || 'Error al cargar cursos'); })
      .finally(() => { if (!cancelado) setLoading(false); });

    return () => { cancelado = true; };
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setError('');
    setLoading(true);
  };

  return (
    <div className="lista-page">
      <div className="lista-filters">
        <input name="titulo" placeholder="Buscar por titulo..." value={filters.titulo} onChange={handleChange} />
        <select name="categoria" value={filters.categoria} onChange={handleChange}>
          <option value="">Todas las categorias</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <select name="nivel" value={filters.nivel} onChange={handleChange}>
          <option value="">Todos los niveles</option>
          {NIVELES.filter(Boolean).map((n) => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
        </select>
      </div>

      {loading && <div className="dash-loading">Cargando cursos...</div>}
      {error && <div className="dash-error">{error}</div>}

      {!loading && !error && (
        <div className="lista-grid" style={{ marginTop: 24 }}>
          {cursos.length === 0 ? (
            <p className="lista-empty-message">No se encontraron cursos.</p>
          ) : (
            cursos.map((curso) => <CursoCard key={curso._id} curso={curso} />)
          )}
        </div>
      )}
    </div>
  );
}
