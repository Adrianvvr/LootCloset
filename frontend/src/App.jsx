import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Armario from './pages/Armario';
import NuevaPrenda from './pages/NuevaPrenda';
import CreadorOutfits from './pages/CreadorOutfits';
import MisOutfits from './pages/MisOutfits'; 
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // <-- IMPORTAMOS EL GUARDIA

function App() {
  return (
    <Router>
      <Routes>
        {/* ======================= */}
        {/*     RUTAS PÚBLICAS      */}
        {/* ======================= */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        
        {/* ======================= */}
        {/*    RUTAS PROTEGIDAS     */}
        {/* ======================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/armario" element={<Armario />} />
          <Route path="/nueva-prenda" element={<NuevaPrenda />} />
          <Route path="/editar-prenda/:id" element={<NuevaPrenda />} />
          <Route path="/crear-outfit" element={<CreadorOutfits />} />
          <Route path="/editar-outfit/:id" element={<CreadorOutfits />} />
          <Route path="/mis-outfits" element={<MisOutfits />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
        </Route>
        
        {/* ======================= */}
        {/*      RUTA COMODÍN       */}
        {/* ======================= */}
        {/* Si alguien escribe una URL que no existe, lo mandamos al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;