import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa los estilos del calendario
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

const App = () => {
  const [guardias, setGuardias] = useState(() => {
    const saved = localStorage.getItem('guardiasData');
    return saved ? JSON.parse(saved) : { Guardias: { Mes: {} } };
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newGuardia, setNewGuardia] = useState({
    horas_de_guardia: '',
    centro: '',
    especialidad: '',
  });
  const [editId, setEditId] = useState(null); // Para manejar la edición de guardias

  useEffect(() => {
    localStorage.setItem('guardiasData', JSON.stringify(guardias));
  }, [guardias]);

  const agregarGuardia = () => {
    if (newGuardia.horas_de_guardia && newGuardia.centro && newGuardia.especialidad) {
      const id = editId || uuidv4(); // Genera un ID único o usa el existente si estamos editando
      const nuevaGuardia = {
        día: selectedDate.toISOString().split('T')[0], // Convertir a YYYY-MM-DD
        horas_de_guardia: newGuardia.horas_de_guardia,
        centro: newGuardia.centro,
        especialidad: newGuardia.especialidad,
      };

      setGuardias((prev) => ({
        ...prev,
        Guardias: {
          ...prev.Guardias,
          Mes: {
            ...prev.Guardias.Mes,
            [id]: nuevaGuardia,
          },
        },
      }));
      setNewGuardia({ horas_de_guardia: '', centro: '', especialidad: '' });
      setEditId(null);
    }
  };

  const eliminarGuardia = (id) => {
    setGuardias((prev) => {
      const updatedMes = { ...prev.Guardias.Mes };
      delete updatedMes[id];
      return { ...prev, Guardias: { ...prev.Guardias, Mes: updatedMes } };
    });
  };

  const editarGuardia = (id) => {
    const guardia = guardias.Guardias.Mes[id];
    setNewGuardia({
      horas_de_guardia: guardia.horas_de_guardia,
      centro: guardia.centro,
      especialidad: guardia.especialidad,
    });
    setSelectedDate(new Date(guardia.día));
    setEditId(id);
  };

  return (
    <div id="content">
      <h1>Organización de Guardias Claudia García-Granados Robayna</h1>
      
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
      />

      <div id="form">
        <p>Fecha seleccionada: {selectedDate.toISOString().split('T')[0]}</p>
        <input
          type="number"
          placeholder="Horas de guardia"
          value={newGuardia.horas_de_guardia}
          onChange={(e) => setNewGuardia({ ...newGuardia, horas_de_guardia: e.target.value })}
        />
        <input
          type="text"
          placeholder="Centro"
          value={newGuardia.centro}
          onChange={(e) => setNewGuardia({ ...newGuardia, centro: e.target.value })}
        />
        <input
          type="text"
          placeholder="Especialidad"
          value={newGuardia.especialidad}
          onChange={(e) => setNewGuardia({ ...newGuardia, especialidad: e.target.value })}
        />
        <button onClick={agregarGuardia}>
          {editId ? 'Actualizar Guardia' : 'Agregar Guardia'}
        </button>
      </div>

      <ul id="guardias-list">
      <h2 style={{margin: ' 0 auto 15px auto'}}>Guardias</h2>
        {Object.keys(guardias.Guardias.Mes).map((id) => (
          <li key={id}>
            {`${guardias.Guardias.Mes[id].día} - ${guardias.Guardias.Mes[id].horas_de_guardia} horas en ${guardias.Guardias.Mes[id].centro} (${guardias.Guardias.Mes[id].especialidad})`}
            <button onClick={() => editarGuardia(id)}>Editar</button>
            <button onClick={() => eliminarGuardia(id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
