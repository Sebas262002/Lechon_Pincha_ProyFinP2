import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => (
  <nav className="navbar">
    <ul>
      <li><Link to="/inicio">Inicio</Link></li>
      <li><Link to="/profesores">Profesores</Link></li>
      <li><Link to="/asignaturas">Asignaturas</Link></li>
      <li><Link to="/asignaciones">Asignaciones</Link></li>
      <li><Link to="/acerca-de">Acerca de</Link></li>
    </ul>
  </nav>
);

export default Navbar;
