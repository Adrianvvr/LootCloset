import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Armario from './pages/Armario';
import NuevaPrenda from './pages/NuevaPrenda';
import CreadorOutfits from './pages/CreadorOutfits';
import MisOutfits from './pages/MisOutfits'; 
import Calendario from './pages/Calendario';
import GeneradorOutfit from './pages/GeneradorOutfit'; 
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';

function App() {
  return (
    <Router>
      <Routes>
        {/* ============================================================ */}
        {/* TODAS LAS RUTAS DENTRO DE ESTE GRUPO TENDRÁN NAVBAR Y FOOTER */}
        {/* ============================================================ */}
        <Route element={<Layout />}>
          
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          
          {/* RUTAS PROTEGIDAS (Solo accesibles con Token) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/armario" element={<Armario />} />
            <Route path="/nueva-prenda" element={<NuevaPrenda />} />
            <Route path="/editar-prenda/:id" element={<NuevaPrenda />} />
            <Route path="/crear-outfit" element={<CreadorOutfits />} />
            <Route path="/generar-outfit" element={<GeneradorOutfit />} />
            <Route path="/editar-outfit/:id" element={<CreadorOutfits />} />
            <Route path="/mis-outfits" element={<MisOutfits />} /> 
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/perfil" element={<Perfil />} />          </Route>

        </Route>
        {/* ============================================================ */}
        
        {/* Si la ruta no existe, enviamos al Inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
