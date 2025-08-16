import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConveniosList from './pages/Convenios/ConveniosList';
import ConvenioForm from './pages/Convenios/ConvenioForm';
import VersionesConvenio from './pages/Convenios/VersionesConvenio';
import CompararVersiones from './pages/Convenios/CompararVersiones';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ConveniosList />} />
      <Route path="/nuevo" element={<ConvenioForm />} />
      <Route path="/editar/:id" element={<ConvenioForm />} />
      <Route path="/convenios/:id/versiones" element={<VersionesConvenio />} />
      <Route path="/convenios/:id/comparar" element={<CompararVersiones />} />
    </Routes>
  </BrowserRouter>
);

export default App;