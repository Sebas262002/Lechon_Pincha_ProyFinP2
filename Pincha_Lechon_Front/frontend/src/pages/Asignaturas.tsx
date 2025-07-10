import { useEffect, useState } from 'react';

interface Asignatura {
  id_asignatura: number;
  nombre: string;
  horas: number;
}

const Asignaturas = () => {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [nombre, setNombre] = useState('');
  const [horas, setHoras] = useState<number>(0);
  const [error, setError] = useState('');
  const [editingAsignatura, setEditingAsignatura] = useState<Asignatura | null>(null);

  const API_URL = 'http://localhost:3000/api/asignaturas';

  const fetchAsignaturas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAsignaturas(data);
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
    }
  };

  const handleSubmit = async () => {
    if (!nombre.trim() || horas <= 0 || isNaN(horas)) {
      setError('Todos los campos son obligatorios y las horas deben ser mayores a 0.');
      return;
    }

    try {
      if (editingAsignatura) {
        const res = await fetch(`${API_URL}/${editingAsignatura.id_asignatura}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, horas }),
        });

        if (res.ok) {
          setEditingAsignatura(null);
          limpiarFormulario();
          fetchAsignaturas();
        }
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, horas }),
        });

        if (res.ok) {
          limpiarFormulario();
          fetchAsignaturas();
        }
      }
    } catch (error) {
      console.error('Error al guardar asignatura:', error);
    }
  };

  const handleEdit = (asignatura: Asignatura) => {
    setNombre(asignatura.nombre);
    setHoras(asignatura.horas);
    setEditingAsignatura(asignatura);
    setError('');
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('¿Seguro que deseas eliminar esta asignatura?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchAsignaturas();
      }
    } catch (error) {
      console.error('Error al eliminar asignatura:', error);
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setHoras(0);
    setError('');
  };

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  return (
    <div className="container">
      <h2>Asignaturas</h2>

      <div>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Horas"
          value={horas}
          onChange={(e) => setHoras(Number(e.target.value))}
        />
        <button onClick={handleSubmit}>{editingAsignatura ? 'Actualizar' : 'Agregar'}</button>
        <button onClick={limpiarFormulario}>Limpiar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Horas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaturas.map((asig) => (
            <tr key={asig.id_asignatura}>
              <td>{asig.nombre}</td>
              <td>{asig.horas}</td>
              <td>
                <button onClick={() => handleEdit(asig)}>Editar</button>
                <button onClick={() => handleDelete(asig.id_asignatura)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Asignaturas;
