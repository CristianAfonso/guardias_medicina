import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { v4 as uuidv4 } from 'uuid'; 

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
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem('guardiasData', JSON.stringify(guardias));
  }, [guardias]);

  const agregarGuardia = () => {
    if (newGuardia.horas_de_guardia && newGuardia.centro && newGuardia.especialidad) {
      const id = editId || uuidv4();
      const nuevaGuardia = {
        dia: selectedDate.toISOString().split('T')[0],
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
    setSelectedDate(new Date(guardia.dia));
    setEditId(id);
  };

  const esDiaDescanso = (fecha) => {
    const diaSemana = fecha.getDay(); 
    if (diaSemana === 5) return false;
    if (diaSemana === 6 || diaSemana === 0) return true;
    return true;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {

      const guardiaDias = Object.values(guardias.Guardias.Mes).map((guardia) => guardia.dia);
      if (guardiaDias.includes(date.toISOString().split('T')[0])) {
        return 'guardia';
      }

      for (let key in guardias.Guardias.Mes) {
        const guardia = guardias.Guardias.Mes[key];
        const fechaGuardia = new Date(guardia.dia);
        const diaSiguiente = new Date(fechaGuardia);
        diaSiguiente.setDate(fechaGuardia.getDate() + 1);

        if (esDiaDescanso(diaSiguiente) && date.toISOString().split('T')[0] === diaSiguiente.toISOString().split('T')[0]) {
          return 'descanso';
        }
      }
    }
    return null;
  };

  return (
    <div id="content">
      <h1>Organización de Guardias Médicas</h1>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName} // Aplicar las clases CSS
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
        <h2>Guardias del Mes</h2>
        {Object.keys(guardias.Guardias.Mes).map((id) => (
          <li key={id}>
            {`${guardias.Guardias.Mes[id].dia} - ${guardias.Guardias.Mes[id].horas_de_guardia} horas en ${guardias.Guardias.Mes[id].centro} (${guardias.Guardias.Mes[id].especialidad})`}
            <button onClick={() => editarGuardia(id)}>Editar</button>
            <button onClick={() => eliminarGuardia(id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
