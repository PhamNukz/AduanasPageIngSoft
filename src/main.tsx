import React from 'react';
import ReactDOM from 'react-dom/client';
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import App from './App.jsx'; // <--- EL CAMBIO MÁS IMPORTANTE ESTÁ AQUÍ
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </HeroUIProvider>
  </React.StrictMode>
);