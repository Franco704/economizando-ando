// Todo el temario listo para las vistas. El orden de los agregados es el de la versión anterior:
// las preguntas de Blanco van al final del cuestionario de cada lección, así no cambian los ids guardados.
import { PARCIALES, MODULOS } from './catalogo.js';
import { LESSONS } from './lecciones.js';
import '../bibliografia/preguntas-de-blanco.js';
import { CUADROS } from '../bibliografia/cuadros-grises.js';
import '../practicos/puntos-de-investigacion.js';
import { EXAMS } from '../examenes/parciales-reales.js';
import { INTEGRAL } from '../examenes/integral.js';

export { PARCIALES, MODULOS, CUADROS, EXAMS as PARCIALES_REALES, INTEGRAL };
export const LECCIONES = LESSONS;
const porId = Object.fromEntries(LECCIONES.map((l) => [l.id, l]));
export const leccion = (id) => porId[id];

export const PREGUNTAS = LECCIONES.flatMap((l) => (l.quiz || []).map((q, i) => ({ ...q, id: `${l.id}:${i}`, lesson: l, module: l.module })));
// Integral: cada pregunta apunta (l) a la lección que conviene releer si se falla
export const PREGUNTAS_INTEGRAL = INTEGRAL.questions.map((q, i) => { const l = porId[q.l] || LECCIONES[0]; return { ...q, id: `int:${i}`, lesson: l, module: l.module }; });
export const preguntaPorId = Object.fromEntries([...PREGUNTAS, ...PREGUNTAS_INTEGRAL].map((q) => [q.id, q]));
export const EJERCICIOS = LECCIONES.flatMap((l) => (l.exercises || []).map((ex) => ({ ex, l })));

export const parcial = (id) => PARCIALES.find((u) => u.id === id);
export const modulo = (id) => MODULOS.find((m) => m.id === id);
export const leccionesDe = (modId) => LECCIONES.filter((l) => l.module === modId);
