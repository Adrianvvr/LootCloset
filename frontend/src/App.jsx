import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Armario from './pages/Armario';
import NuevaPrenda from './pages/NuevaPrenda';
import CreadorOutfits from './pages/CreadorOutfits';
import MisOutfits from './pages/MisOutfits'; 
import Dashboard from './pages/Dashboard'; // <-- NUEVA IMPORTACIÓN

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/armario" element={<Armario />} />
        <Route path="/nueva-prenda" element={<NuevaPrenda />} />
        <Route path="/editar-prenda/:id" element={<NuevaPrenda />} />
        <Route path="/crear-outfit" element={<CreadorOutfits />} />
        <Route path="/editar-outfit/:id" element={<CreadorOutfits />} />
        <Route path="/mis-outfits" element={<MisOutfits />} /> 
        
        {/* NUEVA RUTA PARA EL DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} /> 
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;