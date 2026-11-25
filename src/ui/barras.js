// Avance de un tema como un pequeño gráfico de barras: una barra por lección, llena si está hecha.
export const barras = (hechas, total) => `<span class="barras" role="img" aria-label="${hechas} de ${total} lecciones hechas">${
  Array.from({ length: total }, (_, i) => `<i style="--h:${40 + ((i * 37) % 60)}%"${i < hechas ? ' class="llena"' : ''}></i>`).join('')}</span>`;
