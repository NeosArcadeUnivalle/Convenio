import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

const AlertasConvenios = () => {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    api.get('/convenios/proximos-vencer')
      .then(res => setAlertas(res.data))
      .catch(err => console.error('Error al cargar alertas', err));
  }, []);

  if (alertas.length === 0) return null;

  return (
    <div style={{ background: '#fff3cd', padding: '1rem', margin: '1rem 0', border: '1px solid #ffeeba' }}>
      <h3>⚠️ Convenios próximos a vencer</h3>
      <ul>
        {alertas.map(c => (
          <li key={c.id}>
            <strong>{c.titulo}</strong> — vence el {c.fecha_vencimiento}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertasConvenios;