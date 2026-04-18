import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Armario from './pages/Armario';
import NuevaPrenda from './pages/NuevaPrenda'; // <-- NUEVA PANTALLA IMPORTADA

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/armario" element={<Armario />} />
        <Route path="/nueva-prenda" element={<NuevaPrenda />} /> {/* <-- NUEVA RUTA */}
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;