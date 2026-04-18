import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Armario from './pages/Armario';
import NuevaPrenda from './pages/NuevaPrenda';
import CreadorOutfits from './pages/CreadorOutfits'; // <-- IMPORTAMOS LA NUEVA PANTALLA

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/armario" element={<Armario />} />
        <Route path="/nueva-prenda" element={<NuevaPrenda />} />
        <Route path="/crear-outfit" element={<CreadorOutfits />} /> {/* <-- NUEVA RUTA */}
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;