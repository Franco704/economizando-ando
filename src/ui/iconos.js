// Íconos de trazo (24×24). Siempre decorativos: el texto o el aria-label del botón dice qué hacen.
const P = {
  menu: 'M4 7h16M4 12h16M4 17h10',
  cerrar: 'M6 6l12 12M18 6L6 18',
  luna: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  inicio: 'M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z',
  indice: 'M5 6h2M10 6h9M5 12h2M10 12h9M5 18h2M10 18h9',
  grafica: 'M4 4v16h16M7 7c3 0 6 4 11 10M7 17c4-1 7-5 11-10',
  parciales: 'M7 3h10v18H7zM10 8h4M10 12h4M10 16h2',
  formula: 'M6 20c2 0 2-2 3-8s1-8 4-8M5 10h7M14 13l5 6M19 13l-5 6',
  cuadro: 'M4 5h16v14H4zM8 9h8M8 13h6',
  simulacro: 'M12 3l2.5 5 5.5.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.5-.8z',
  integral: 'M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z',
  repasar: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4',
};
export const icono = (n, tam = 20) => `<svg viewBox="0 0 24 24" width="${tam}" height="${tam}" aria-hidden="true" focusable="false"><path d="${P[n]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
