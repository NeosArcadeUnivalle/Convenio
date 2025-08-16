import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';

const ConvenioForm = () => {
  const [form, setForm] = useState({
    titulo: '',
    entidad_firmante: '',
    fecha_firma: '',
    fecha_vencimiento: '',
    estado: 'vigente',
    riesgo: 'bajo',
    descripcion: '',
  });
  const [archivo, setArchivo] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      api.get(`/convenios/${id}`).then(res => {
        setForm({
          titulo: res.data.titulo,
          entidad_firmante: res.data.entidad_firmante,
          fecha_firma: res.data.fecha_firma,
          fecha_vencimiento: res.data.fecha_vencimiento ?? '',
          estado: res.data.estado,
          riesgo: res.data.riesgo ?? 'bajo',
          descripcion: res.data.descripcion ?? '',
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach(key => {
      data.append(key, form[key]);
    });
    if (archivo) {
      data.append('archivo', archivo);
    }

    const request = isEdit
      ? api.post(`/convenios/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.post('/convenios', data, { headers: { 'Content-Type': 'multipart/form-data' } });

    request
      .then(() => {
        alert(`Convenio ${isEdit ? 'actualizado' : 'creado'} correctamente`);
        navigate('/');
      })
      .catch(err => {
        console.error(err);
        alert('Error al guardar el convenio');
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
      padding: '1rem', border: '1px solid #ddd', borderRadius: '6px', maxWidth: '600px', margin: '0 auto',
      background: '#fafafa'
    }}>
      <h2>{isEdit ? '✏️ Editar Convenio' : '📝 Registrar Convenio'}</h2>

      <input
        name="titulo"
        placeholder="Título"
        value={form.titulo}
        onChange={handleChange}
        required
        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <input
        name="entidad_firmante"
        placeholder="Entidad"
        value={form.entidad_firmante}
        onChange={handleChange}
        required
        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <input
        name="fecha_firma"
        type="date"
        value={form.fecha_firma}
        onChange={handleChange}
        required
        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <input
        name="fecha_vencimiento"
        type="date"
        value={form.fecha_vencimiento}
        onChange={handleChange}
        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
      />

      <select name="estado" value={form.estado} onChange={handleChange} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <option value="vigente">Vigente</option>
        <option value="vencido">Vencido</option>
        <option value="en_negociacion">En negociación</option>
      </select>

      <select name="riesgo" value={form.riesgo} onChange={handleChange} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <option value="bajo">Bajo</option>
        <option value="medio">Medio</option>
        <option value="alto">Alto</option>
      </select>

      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={handleChange}
        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' }}
      ></textarea>

      <input type="file" name="archivo" accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />

      <button type="submit" style={{ background: isEdit ? '#ffc107' : '#28a745', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        {isEdit ? 'Actualizar' : 'Guardar'}
      </button>
    </form>
  );
};

export default ConvenioForm;