import React, {  useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; 

export default function GuardiaForm({guardias, newGuardia, editId,selectedDate = new Date(), setGuardias, setEditId, setNewGuardia}){

    
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
    return(
        <div id="form" className='container'>
            <p>Fecha seleccionada: {selectedDate.toLocaleDateString()}</p>
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
            <button className="button" onClick={agregarGuardia}>
              {editId ? 'Actualizar Guardia' : 'Agregar Guardia'}
            </button>
        </div>
    )
}