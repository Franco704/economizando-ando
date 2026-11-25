// Autocomprobación del contenido: carga todo el temario y valida su estructura. Uso: npm test
import assert from 'node:assert';
import { LECCIONES, MODULOS, PREGUNTAS, PREGUNTAS_INTEGRAL, CUADROS, PARCIALES_REALES, EJERCICIOS, INTEGRAL, leccion } from '../src/temario/indice.js';
import { LABORATORIOS } from '../src/laboratorios/indice.js';
import { FORMULAS } from '../src/estudio/formulas.js';

const ids = new Set();
for (const l of LECCIONES) {
  assert(!ids.has(l.id), `id repetido ${l.id}`); ids.add(l.id);
  assert(MODULOS.some((m) => m.id === l.module), `tema inexistente en ${l.id}`);
  assert(l.title && l.tldr && l.body, `lección incompleta ${l.id}`);
  for (const c of l.labs || []) assert(LABORATORIOS[c.type], `laboratorio ${c.type} en ${l.id}`);
  [...l.body.matchAll(/data-lab="(\d+)"/g)].forEach((m) => assert(l.labs?.[+m[1]], `lab(${m[1]}) sin definir en ${l.id}`));
}
for (const q of [...PREGUNTAS, ...PREGUNTAS_INTEGRAL]) assert(q.a >= 0 && q.a < q.o.length, `respuesta fuera de rango: ${q.q}`);
for (const q of INTEGRAL.questions) assert(leccion(q.l), `integral apunta a una lección inexistente: ${q.l}`);
const examenes = new Set(PARCIALES_REALES.map((e) => e.id));
for (const { ex, l } of EJERCICIOS) for (const k of ex.exam || []) assert(examenes.has(k.split('#')[0]), `parcial inexistente ${k} en ${l.id}`);
FORMULAS.forEach((f) => assert(MODULOS.some((m) => m.id === f.m), `fórmula con tema inexistente: ${f.n}`));
console.log(`contenido OK: ${LECCIONES.length} lecciones, ${PREGUNTAS.length} preguntas, ${PREGUNTAS_INTEGRAL.length} del integral, ${EJERCICIOS.length} ejercicios, ${CUADROS.length} cuadros, ${PARCIALES_REALES.length} parciales`);
