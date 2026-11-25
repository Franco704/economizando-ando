// Raíz de composición: conecta el armazón, las rutas y las vistas.
import { $ } from './nucleo/dom.js';
import { rutaActual } from './nucleo/router.js';
import { LECCIONES, modulo } from './temario/indice.js';
import { entrada } from './animaciones/entrada.js';
import { montarArmazon, pintarIndice, cerrarMenu, enfocarBusqueda } from './ui/armazon.js';
import { vistaInicio } from './vistas/inicio.js';
import { vistaLeccion } from './vistas/leccion.js';
import { vistaCuestionarioTema, vistaSimulacro, vistaRepaso, vistaIntegral } from './vistas/cuestionarios.js';
import { vistaGraficas, vistaFormulas, vistaCuadros, vistaParciales } from './vistas/recursos.js';

const main = $('#principal');
montarArmazon();

let primeraCarga = true;
let limpiar = null;   // el integral deja un reloj andando
async function resolver() {
  const id = rutaActual();
  const idx = LECCIONES.findIndex((l) => l.id === id);
  // Pantalla de entrada al cambiar de tema; si mientras tanto cambió la ruta, gana la nueva
  if (idx !== -1) { await entrada(id, primeraCarga); if (rutaActual() !== id) return; }
  primeraCarga = false;
  limpiar?.(); limpiar = null;
  delete document.body.dataset.unit;
  $('#riel').innerHTML = '';
  const [raiz, arg] = [id.split('/')[0], id.split('/').slice(1).join('/')];
  if (idx !== -1) vistaLeccion(main, idx);
  else if (raiz === 'quiz' && modulo(arg)) vistaCuestionarioTema(main, modulo(arg));
  else if (raiz === 'simulacro') vistaSimulacro(main, arg);
  else if (raiz === 'repaso') vistaRepaso(main);
  else if (raiz === 'integral') limpiar = vistaIntegral(main);
  else if (raiz === 'graficas') vistaGraficas(main);
  else if (raiz === 'formulas') vistaFormulas(main);
  else if (raiz === 'cuadros') vistaCuadros(main);
  else if (raiz === 'parciales') vistaParciales(main);
  else vistaInicio(main);
  document.body.dataset.view = idx !== -1 ? 'leccion' : raiz || 'inicio';
  pintarIndice();
  cerrarMenu();
  scrollTo(0, 0);
  main.focus({ preventScroll: true });
}

addEventListener('hashchange', resolver);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { cerrarMenu(); return; }
  if (e.target.closest('input, textarea, select, [contenteditable]') || e.altKey || e.ctrlKey || e.metaKey) return;
  const idx = LECCIONES.findIndex((l) => l.id === rutaActual());
  if (e.key === 'ArrowRight' && idx > -1 && idx < LECCIONES.length - 1) location.hash = `#/${LECCIONES[idx + 1].id}`;
  if (e.key === 'ArrowLeft' && idx > 0) location.hash = `#/${LECCIONES[idx - 1].id}`;
  if (e.key === '/') { e.preventDefault(); enfocarBusqueda(); }
});
resolver();
