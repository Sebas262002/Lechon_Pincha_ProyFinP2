import { useEffect, useState } from 'react';

interface Profesor {
  id_profesor: number;
  nombre: string;
}

interface Asignatura {
  id_asignatura: number;
  nombre: string;
}

interface Asignacion {
  id_profesor: number;
  id_asignatura: number;
  profesor: string;
  asignatura: string;
}

const Asignaciones = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [idProfesor, setIdProfesor] = useState<number>(0);
  const [idAsignatura, setIdAsignatura] = useState<number>(0);
  const [error, setError] = useState('');

  const fetchDatos = async () => {
    try {
      const profRes = await fetch('http://localhost:3000/api/profesores');
      const profData = await profRes.json();
      setProfesores(profData);

      const asigRes = await fetch('http://localhost:3000/api/asignaturas');
      const asigData = await asigRes.json();
      setAsignaturas(asigData);

      const relRes = await fetch('http://localhost:3000/api/asignaciones');
      const relData = await relRes.json();
      setAsignaciones(relData.data);  // ✅ Aquí era el error
    } catch (e) {
      console.error('Error cargando datos:', e);
      setError('Error al cargar los datos. Verifica la conexión con la API.');
    }
  };

  const crearAsignacion = async () => {
    if (!idProfesor || !idAsignatura) {
      setError('Debe seleccionar un profesor y una asignatura.');
      return;
    }

    const res = await fetch('http://localhost:3000/api/asignaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_profesor: idProfesor, id_asignatura: idAsignatura }),
    });

    if (res.ok) {
      setError('');
      fetchDatos();
    } else {
      setError('No se pudo crear la asignación.');
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  return (
    <div className="container">
      <h2>Asignaciones</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <select value={idProfesor} onChange={(e) => setIdProfesor(Number(e.target.value))}>
          <option value={0}>Seleccione Profesor</option>
          {profesores.map((prof) => (
            <option key={prof.id_profesor} value={prof.id_profesor}>
              {prof.nombre}
            </option>
          ))}
        </select>

        <select value={idAsignatura} onChange={(e) => setIdAsignatura(Number(e.target.value))}>
          <option value={0}>Seleccione Asignatura</option>
          {asignaturas.map((asig) => (
            <option key={asig.id_asignatura} value={asig.id_asignatura}>
              {asig.nombre}
            </option>
          ))}
        </select>

        <button onClick={crearAsignacion}>Asignar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Profesor</th>
            <th>Asignatura</th>
          </tr>
        </thead>
        <tbody>
          {asignaciones.map((asig, index) => (
            <tr key={index}>
              <td>{asig.profesor}</td>
              <td>{asig.asignatura}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Asignaciones;
