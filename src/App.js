import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import GuardiaForm from './components/guardia_form';
import './styles.css'
const App = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [guardias, setGuardias] = useState(() => {
    const saved = localStorage.getItem('guardiasData');
    return saved ? JSON.parse(saved) : { Guardias: { Mes: {} } };
  });

  const [newGuardia, setNewGuardia] = useState({
    horas_de_guardia: '',
    centro: '',
    especialidad: '',
  });
  const [editId, setEditId] = useState(null);

  const esDiaDescanso = (fecha) => {
    const diaSemana = fecha.getDay(); 
    if (diaSemana === 4) return false;
    if (diaSemana === 6 || diaSemana === 0) return true;
    return true;
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
        diaSiguiente.setDate(fechaGuardia.getDay() === 5 ? fechaGuardia.getDate() + 2 : fechaGuardia.getDate() + 1);

        if (esDiaDescanso(fechaGuardia) && date.toISOString().split('T')[0] === diaSiguiente.toISOString().split('T')[0]) {
          return 'descanso';
        }
      }
    }
    return null;
  };

  return (
    <div id="content-wrapper">
      <h1>Organización de Guardias Médicas</h1>
      <div id="content">
        <div id="control-wrapper">
          <Calendar  className='container'
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
          />
          <GuardiaForm 
            guardias={guardias}
            newGuardia={newGuardia}
            editId={editId}
            selectedDate={selectedDate}
            setGuardias={setGuardias}
            setNewGuardia={setNewGuardia}
            setEditId={setEditId}/>
        </div>
        <div id="guardias-wrapper"  className='container'>
          <div id="guardias-title">
            <h2>Guardias del Mes</h2>
            <hr></hr>
          </div>
          <div id="guardias-list"> 
            {Object.keys(guardias.Guardias.Mes).map((id) => (
              <div className='guardia-card container' key={id}>
                {console.log(guardias.Guardias.Mes[id])}
                {`${guardias.Guardias.Mes[id].dia} - ${guardias.Guardias.Mes[id].horas_de_guardia} horas en ${guardias.Guardias.Mes[id].centro} (${guardias.Guardias.Mes[id].especialidad})`}
                <div className='button-group'>
                  <button className="button" onClick={() => editarGuardia(id)}>Editar</button>
                  <button className="button" onClick={() => eliminarGuardia(id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
