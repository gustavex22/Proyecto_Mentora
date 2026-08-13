export function TemarioSeccion({
  seccion,
  abierta,
  onToggle,
  onMarcarLeccion,
  onSelectLeccion,
  inscripcionId,
  progresoMap,
  leccionActualId,
}) {
  return (
    <div className="aprendizaje-seccion">
      <div className="aprendizaje-seccion-header" onClick={onToggle}>
        <span>{seccion.titulo}</span>
        <span>{abierta ? '▲' : '▼'}</span>
      </div>
      {abierta && seccion.lecciones?.map((leccion) => {
        const estaCompletada = progresoMap[leccion._id];
        const esActiva = leccion._id === leccionActualId;
        return (
          <div
            key={leccion._id}
            className={`aprendizaje-leccion ${estaCompletada ? 'completada' : ''} ${esActiva ? 'activa' : ''}`}
          >
            <input
              type="checkbox"
              checked={!!estaCompletada}
              onChange={() => onMarcarLeccion(inscripcionId, leccion._id)}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="aprendizaje-leccion-btn"
              onClick={() => onSelectLeccion(leccion)}
            >
              {leccion.titulo}
            </button>
          </div>
        );
      })}
    </div>
  );
}
