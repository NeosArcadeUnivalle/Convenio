import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import DiffMatchPatch from 'diff-match-patch';

const CompararVersiones = () => {
  const { id } = useParams();
  const [versiones, setVersiones] = useState([]);
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    api.get(`/convenios/${id}/versiones`)
      .then(res => setVersiones(res.data))
      .catch(err => console.error('Error al cargar versiones', err));
  }, [id]);

  const comparar = async () => {
    if (!v1 || !v2 || v1 === v2) {
      alert('Debes seleccionar dos versiones diferentes');
      return;
    }

    try {
      const texto1 = await api.get(`/versiones/${v1}/leer`).then(r => r.data.contenido);
      const texto2 = await api.get(`/versiones/${v2}/leer`).then(r => r.data.contenido);

      const dmp = new DiffMatchPatch();
      const diffs = dmp.diff_main(texto1, texto2);
      dmp.diff_cleanupSemantic(diffs);

      const html = diffs.map(([op, data], i) => {
        if (op === 0) return `<span>${data}</span>`;
        if (op === -1) return `<span style="background:#ffe6e6;color:#b30000;text-decoration:line-through;">${data}</span>`;
        if (op === 1) return `<span style="background:#e6ffe6;color:#006600;">${data}</span>`;
        return '';
      }).join('');

      setResultado(html);
    } catch (error) {
      console.error('Error comparando archivos:', error);
      alert('No se pudo comparar estas versiones (usa TXT/PDF/DOCX por ahora)');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>📑 Comparar Versiones del Convenio</h2>

      {/* Controles */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        <select onChange={(e) => setV1(e.target.value)} value={v1}>
          <option value="">Seleccionar versión 1</option>
          {versiones.map(v => (
            <option key={v.id} value={v.id}>
              Versión {v.id} - {v.descripcion}
            </option>
          ))}
        </select>

        <select onChange={(e) => setV2(e.target.value)} value={v2}>
          <option value="">Seleccionar versión 2</option>
          {versiones.map(v => (
            <option key={v.id} value={v.id}>
              Versión {v.id} - {v.descripcion}
            </option>
          ))}
        </select>

        <button onClick={comparar} style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderRadius: '4px'
        }}>
          🔍 Comparar
        </button>
      </div>

      {/* Resultado */}
      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '6px',
          background: '#fafafa',
          maxHeight: '400px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.5'
        }}
        dangerouslySetInnerHTML={{ __html: resultado }}
      />
    </div>
  );
};

export default CompararVersiones;