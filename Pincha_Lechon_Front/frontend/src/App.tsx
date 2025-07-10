import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Profesores from './pages/Profesores';
import Asignaturas from './pages/Asignaturas';
import Asignaciones from './pages/Asignaciones';
import AcercaDe from './pages/AcercaDe';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/profesores" element={<Profesores />} />
        <Route path="/asignaturas" element={<Asignaturas />} />
        <Route path="/asignaciones" element={<Asignaciones />} />
        <Route path="/acerca-de" element={<AcercaDe />} />
      </Routes>
    </div>
  );
}

export default App;
