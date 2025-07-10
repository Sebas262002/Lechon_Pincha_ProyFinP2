import { useEffect, useState } from 'react';

interface Profesor {
  id_profesor: number;
  nombre: string;
  especialidad: string;
}

const Profesores = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [error, setError] = useState('');
  const [editingProfesor, setEditingProfesor] = useState<Profesor | null>(null);

  const API_URL = 'http://localhost:3000/api/profesores';

  const fetchProfesores = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProfesores(data);
    } catch (error) {
      console.error('Error al cargar profesores:', error);
    }
  };

  const handleSubmit = async () => {
    if (!nombre.trim() || !especialidad.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (editingProfesor) {
        // Editar
        const res = await fetch(`${API_URL}/${editingProfesor.id_profesor}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, especialidad }),
        });

        if (res.ok) {
          setEditingProfesor(null);
          limpiarFormulario();
          fetchProfesores();
        }
      } else {
        // Crear
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, especialidad }),
        });

        if (res.ok) {
          limpiarFormulario();
          fetchProfesores();
        }
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEdit = (profesor: Profesor) => {
    setNombre(profesor.nombre);
    setEspecialidad(profesor.especialidad);
    setEditingProfesor(profesor);
    setError('');
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('¿Seguro que deseas eliminar este profesor?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchProfesores();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setEspecialidad('');
    setError('');
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  return (
    <div className="container">
      <h2>Profesores</h2>
      <div>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          placeholder="Especialidad"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
        />
        <button onClick={handleSubmit}>{editingProfesor ? 'Actualizar' : 'Agregar'}</button>
        <button onClick={limpiarFormulario}>Limpiar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((prof) => (
            <tr key={prof.id_profesor}>
              <td>{prof.nombre}</td>
              <td>{prof.especialidad}</td>
              <td>
                <button onClick={() => handleEdit(prof)}>Editar</button>
                <button onClick={() => handleDelete(prof.id_profesor)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profesores;
