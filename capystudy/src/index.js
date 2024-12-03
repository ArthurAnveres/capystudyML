import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Páginas
import { Homepage } from './pages/Homepage';
import { Pomodoro } from './pages/Pomodoro';
import { Registrar } from './pages/Registrar';
import { Login } from './pages/Login';
import { Flash } from './pages/Flash';
import { Forget } from './pages/Esqueci';
import { ChangePassword } from './pages/Alterar';
import { Perfil } from './pages/Perfil';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/flash" element={<Flash />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/esqueci" element={<Forget />} />
        <Route path="/esqueci/:token" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
