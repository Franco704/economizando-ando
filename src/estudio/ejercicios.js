// Ejercicios resueltos: de los TP, de los parciales reales y del integral. También los cuadros grises de Blanco.
import { esc } from '../nucleo/dom.js';
import { PARCIALES_REALES } from '../temario/indice.js';

const NIVEL = { 1: 'Básico', 2: 'Intermedio', 3: 'Desafío' };
const examenPorId = Object.fromEntries(PARCIALES_REALES.map((e) => [e.id, e]));
export const examenDe = (clave) => examenPorId[clave.split('#')[0]];
// exam: ['1p-2024#5'] = pregunta 5 del primer parcial 2024
const chipsDeExamen = (lista) => lista.map(examenDe).filter(Boolean).filter((e, i, a) => a.indexOf(e) === i)
  .map((e) => `<a class="chip acc" href="#/parciales">${e.short}</a>`).join('');

export function ejercicios(lista) {
  let practica = 0;
  return lista.map((ex) => {
    const s = ex.solution;
    const tag = ex.tag || (ex.official ? `TP ${ex.official.split('.')[0]}, ejercicio ${ex.official.split('.')[1]}` : ex.exam ? 'Pregunta de parcial' : `Práctica ${++practica}`);
    const dePartial = !ex.official && ex.exam;
    const archivos = (s.files || []).map((f) => `<div class="sol-file">${f.name ? `<p class="file-name">${f.name}</p>` : ''}<pre class="code" data-lang="${f.lang}">${esc(f.code.trim())}</pre></div>`).join('');
    return `
      <article class="exercise${ex.official ? ' official' : dePartial ? ' parcial' : ''}">
        <header class="ex-head">
          <span class="ex-tag">${tag}</span>
          ${ex.research ? '<span class="ex-research">Punto de investigación</span>' : ''}
          ${ex.level ? `<span class="ex-level">${NIVEL[ex.level]}</span>` : ''}
        </header>
        ${ex.exam ? `<p class="ex-exams"><span>${ex.official ? 'También tomado en' : 'Tomado en'}</span>${chipsDeExamen(ex.exam)}</p>` : ''}
        <h3>${ex.title}</h3>
        <div class="ex-prompt">${ex.prompt}</div>
        ${ex.hints ? `<details class="hint"><summary>Ver pistas</summary><ul>${ex.hints.map((h) => `<li>${h}</li>`).join('')}</ul></details>` : ''}
        <details class="solution"><summary>Ver solución</summary><div class="sol-body">${s.explain ? `<div class="sol-explain">${s.explain}</div>` : ''}${archivos}</div></details>
      </article>`;
  }).join('');
}

export const cuadroGris = (c) => `<aside class="gris"><p>${c.t}</p><p class="gris-src">Blanco, <cite>Economía: teoría y práctica</cite>, cap. ${c.cap}</p></aside>`;
