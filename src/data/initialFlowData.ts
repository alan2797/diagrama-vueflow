export const initialElements = [
  {
    id: 'start-node',
    type: 'start',
    position: { x: 250 - 100 / 2, y: 100 },
    data: {
      label: 'Inicio',
      activado: false,
    },
    style: {
      width: '100px',
    },
  },
  {
    id: 'end-node',
    type: 'end',
    position: { x: 250 - 60 / 2, y: 200 },
    data: {
      label: 'Fin',
      activado: false,
    },
    style: {
      width: '60px',
    },
  },
  {
    id: 'edge-1',
    source: 'start-node',
    target: 'end-node',
    type: 'add', // edge custom
  },
];

// Opcional: Exportar posiciones iniciales por si las necesitas
export const initialPositions = {
  start: { x: 250 - 100 / 2, y: 100 },
  end: { x: 250 - 60 / 2, y: 200 },
};
