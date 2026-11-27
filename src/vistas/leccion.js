// Una lección: lo que resume Blanco, la teoría con sus gráficas, preguntas, ejercicios de los TP y parciales, y bibliografía.
import { $ } from '../nucleo/dom.js';
import { LECCIONES, PREGUNTAS, modulo, parcial, leccionesDe } from '../temario/indice.js';
import { montarLaboratorio } from '../laboratorios/indice.js';
import { montarCuestionario } from '../estudio/opcion-multiple.js';
import { ejercicios, cuadroGris } from '../estudio/ejercicios.js';
import { hechas, alternarHecha } from '../estudio/progreso.js';
import { glifo } from '../animaciones/entrada.js';
import { pintarRiel } from '../ui/armazon.js';

const fuentes = (l) => (l.sources || []).map((s) => `
  <details class="source">
    <summary><span>${s.title}</span><span class="host">${s.url ? new URL(s.url).hostname.replace('www.', '') : s.ref || ''}</span></summary>
    <div class="source-body"><ul>${s.points.map((p) => `<li>${p}</li>`).join('')}</ul>${s.url ? `<p><a href="${s.url}" target="_blank" rel="noopener">Abrir la fuente</a></p>` : ''}</div>
  </details>`).join('');

export function vistaLeccion(main, idx) {
  const l = LECCIONES[idx];
  const m = modulo(l.module);
  const u = parcial(m.unit);
  const prev = LECCIONES[idx - 1], next = LECCIONES[idx + 1];
  const labs = l.labs || [];
  document.body.dataset.unit = m.unit;
  document.title = `${l.title}, Economizando Ando`;

  // Laboratorios que el cuerpo no ubica van al final de la teoría
  const donde = l.body + (l.exercises || []).map((e) => e.prompt).join('');
  const ubicados = new Set([...donde.matchAll(/data-lab="(\d+)"/g)].map((x) => +x[1]));
  const resto = labs.map((_, i) => i).filter((i) => !ubicados.has(i)).map((i) => `<div class="lab-mount" data-lab="${i}"></div>`).join('');
  const ej = ejercicios(l.exercises || []), bib = fuentes(l);
  const quiz = PREGUNTAS.filter((q) => q.lesson === l);
  const delTema = leccionesDe(m.id);

  main.innerHTML = `
    <article class="lesson">
      <header class="lesson-head">
        <p class="crumb"><span class="chip-parcial">${u.title}: ${u.name}</span><a href="#/${delTema[0].id}">Tema ${m.tema}, ${m.title}</a></p>
        <div class="lesson-glyph" aria-hidden="true">${glifo(m.id)}</div>
        <h1>${l.title}</h1>
        <p class="lesson-pos">Lección ${delTema.indexOf(l) + 1} de ${delTema.length} del tema, ${idx + 1} de ${LECCIONES.length} de la materia</p>
      </header>
      <p class="tldr">${l.tldr}</p>
      ${l.goals ? `<div class="goals"><p>Al terminar vas a poder:</p><ul>${l.goals.map((g) => `<li>${g}</li>`).join('')}</ul></div>` : ''}
      ${l.cuadros ? `<section class="cuadros" aria-label="Cuadros grises de Blanco"><p class="cuadros-k">Lo que resume Blanco <a href="#/cuadros">Ver todos los cuadros</a></p>${l.cuadros.map(cuadroGris).join('')}</section>` : ''}
      <div class="body">${l.body}${resto}</div>
      ${quiz.length ? '<section class="check-sec" id="comprobar"><h2>Comprobá lo que entendiste</h2><p class="sec-lede">Elegí una respuesta: la corrección es inmediata. Lo que falles queda guardado para repasar.</p><div class="quiz-mount"></div></section>' : ''}
      ${ej ? `<section class="practice" id="ejercicios"><h2>Ejercicios</h2><p class="sec-lede">Resolvelos en papel, con la gráfica, antes de abrir la solución.</p>${ej}</section>` : ''}
      ${bib ? `<section class="sources" id="bibliografia"><h2>Bibliografía</h2><p class="sec-lede">Qué dice cada fuente sobre este tema.</p>${bib}</section>` : ''}
      <div class="done-row">
        <button class="btn done-btn" type="button" aria-pressed="${hechas.has(l.id)}">${hechas.has(l.id) ? 'Lección completada' : 'Marcar como completada'}</button>
      </div>
      <nav class="pager" aria-label="Lecciones">
        ${prev ? `<a class="prev" href="#/${prev.id}"><small>Anterior</small><strong>${prev.title}</strong></a>` : '<span></span>'}
        ${next ? `<a class="next" href="#/${next.id}"><small>Siguiente</small><strong>${next.title}</strong></a>` : `<a class="next" href="#/quiz/${m.id}"><small>Para cerrar</small><strong>Cuestionario del tema</strong></a>`}
      </nav>
    </article>`;

  main.querySelectorAll('.lab-mount').forEach((el) => { const cfg = labs[+el.dataset.lab]; if (cfg) montarLaboratorio(el, cfg); });
  if (quiz.length) montarCuestionario($('.quiz-mount', main), quiz, { mode: 'inline' });
  $('.done-btn', main).addEventListener('click', (e) => {
    const on = alternarHecha(l.id);
    e.currentTarget.setAttribute('aria-pressed', on);
    e.currentTarget.textContent = on ? 'Lección completada' : 'Marcar como completada';
  });
  pintarRiel(main);
}
