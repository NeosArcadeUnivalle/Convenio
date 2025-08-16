import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import AlertasConvenios from './AlertasConvenios';

const ConveniosList = () => {
  const [convenios, setConvenios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [riesgo, setRiesgo] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current: 1, last: 1 });

  const navigate = useNavigate();

  useEffect(() => {
    fetchConvenios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchConvenios = () => {
    setLoading(true);
    api
      .get('/convenios', {
        params: { search, estado, riesgo, page },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setConvenios(res.data);
          setMeta({ current: 1, last: 1 });
        } else {
          setConvenios(res.data.data);
          setMeta({
            current: res.data.current_page,
            last: res.data.last_page,
          });
        }
      })
      .catch((err) => console.error('Error al obtener convenios', err))
      .finally(() => setLoading(false));
  };

  const eliminar = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este convenio?')) {
      api
        .delete(`/convenios/${id}`)
        .then(() => {
          alert('Convenio eliminado');
          fetchConvenios();
        })
        .catch((err) => console.error('Error al eliminar convenio', err));
    }
  };

  const editar = (id) => {
    navigate(`/editar/${id}`);
  };

  const nuevo = () => {
    navigate('/nuevo');
  };

  const aplicarFiltros = () => {
    setPage(1);
    fetchConvenios();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>📋 Lista de Convenios</h2>

      <AlertasConvenios />

      <button
        onClick={nuevo}
        style={{ background: '#28a745', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', marginBottom: '1rem', cursor: 'pointer' }}
      >
        ➕ Nuevo Convenio
      </button>

      {/* Barra de búsqueda y filtros */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar por título o entidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', flex: '1' }}
        />

        <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">Todos los estados</option>
          <option value="vigente">Vigente</option>
          <option value="vencido">Vencido</option>
          <option value="en_negociacion">En negociación</option>
        </select>

        <select value={riesgo} onChange={(e) => setRiesgo(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">Todos los riesgos</option>
          <option value="bajo">Bajo</option>
          <option value="medio">Medio</option>
          <option value="alto">Alto</option>
        </select>

        <button
          onClick={aplicarFiltros}
          style={{ background: '#007bff', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Filtrar
        </button>
      </div>

      {loading ? (
        <p>Cargando convenios...</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {convenios.map((c) => (
              <li key={c.id} style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>
                <strong>{c.titulo}</strong> — {c.entidad_firmante} ({c.estado}, riesgo: {c.riesgo ?? 'N/A'}){' '}
                {c.archivo && (
                  <a
                    href={`http://localhost:8000/storage/${c.archivo}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: '0.5rem' }}
                  >
                    📎 Ver archivo
                  </a>
                )}
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => navigate(`/convenios/${c.id}/versiones`)} style={{ padding: '0.3rem 0.8rem', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}>📑 Versiones</button>
                  <button onClick={() => editar(c.id)} style={{ padding: '0.3rem 0.8rem', background: '#ffc107', border: 'none', borderRadius: '4px' }}>✏️ Editar</button>
                  <button onClick={() => eliminar(c.id)} style={{ padding: '0.3rem 0.8rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>🗑️ Eliminar</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Paginación */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button disabled={meta.current <= 1} onClick={() => setPage((p) => p - 1)} style={{ padding: '0.3rem 0.8rem' }}>
              ⬅️ Anterior
            </button>
            <span>Página {meta.current} de {meta.last}</span>
            <button disabled={meta.current >= meta.last} onClick={() => setPage((p) => p + 1)} style={{ padding: '0.3rem 0.8rem' }}>
              Siguiente ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConveniosList;