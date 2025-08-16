import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const VersionesConvenio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [versiones, setVersiones] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    fetchVersiones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVersiones = () => {
    api.get(`/convenios/${id}/versiones`)
      .then(res => setVersiones(res.data))
      .catch(err => console.error('Error al cargar versiones', err));
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!archivo) {
      alert('Debes seleccionar un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('descripcion', descripcion);

    api.post(`/convenios/${id}/versiones`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        alert('Versión subida correctamente');
        setArchivo(null);
        setDescripcion('');
        fetchVersiones();
      })
      .catch(err => {
        console.error(err);
        alert('Error al subir la versión');
      });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>📑 Versiones del Convenio</h2>

      {/* Formulario para subir nueva versión */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
        padding: '1rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1rem',
        background: '#fafafa'
      }}>
        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt"
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
        <input
          type="text"
          placeholder="Descripción de cambios"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
          📤 Subir Versión
        </button>
      </form>

      <button
        onClick={() => navigate(`/convenios/${id}/comparar`)}
        style={{ background: '#007bff', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem' }}
      >
        🔍 Comparar Versiones
      </button>

      {/* Listado de versiones */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {versiones.map(v => (
          <li key={v.id} style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>
            <strong>Versión {v.id}</strong> — {v.descripcion ?? 'Sin descripción'} — 
            <a
              href={`http://localhost:8000/storage/${v.archivo}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: '0.5rem', color: '#007bff' }}
            >
              📎 Ver archivo
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VersionesConvenio;