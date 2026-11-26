// Recursos para el parcial: taller de gráficas, fórmulas, cuadros de Blanco y parciales reales resueltos.
import { PARCIALES, MODULOS, LECCIONES, CUADROS, PARCIALES_REALES, EJERCICIOS, leccion, modulo, leccionesDe } from '../temario/indice.js';
import { montarLaboratorio, DE_GRAFICAS } from '../laboratorios/indice.js';
import { FORMULAS } from '../estudio/formulas.js';
import { ejercicios, cuadroGris, examenDe } from '../estudio/ejercicios.js';

const cabeza = (u) => `<h2>${u.name}<span>${u.title}</span></h2>`;

export function vistaGraficas(main) {
  document.title = 'Taller de gráficas, Economizar';
  const todas = LECCIONES.flatMap((l) => (l.labs || []).filter((c) => DE_GRAFICAS.includes(c.type)).map((c) => ({ c, l, m: modulo(l.module) })));
  main.innerHTML = `
    <article class="lesson graficas-page">
      <h1>Taller de gráficas</h1>
      <p class="tldr">Las ${todas.length} gráficas interactivas de la guía en un solo lugar. En cada una, <mark>predecí</mark> qué curva se mueve y hacia dónde, después mové el control y comprobá.</p>
      ${PARCIALES.map((u) => `<section class="seccion-parcial" data-u="${u.id}">${cabeza(u)}
        ${todas.filter((x) => x.m.unit === u.id).map((x) => `<div class="graf-item"><p class="graf-de">Tema ${x.m.tema}, <a href="#/${x.l.id}">${x.l.title}</a></p><div class="lab-mount" data-g="${todas.indexOf(x)}"></div></div>`).join('')}
      </section>`).join('')}
    </article>`;
  main.querySelectorAll('[data-g]').forEach((el) => montarLaboratorio(el, todas[+el.dataset.g].c));
}

export function vistaFormulas(main) {
  document.title = 'Fórmulas, Economizar';
  const conFormulas = (u) => MODULOS.filter((m) => m.unit === u.id && FORMULAS.some((f) => f.m === m.id));
  main.innerHTML = `
    <article class="lesson formulas-page">
      <h1>Fórmulas</h1>
      <p class="tldr">Todo lo que hay que saber calcular, tema por tema. El nombre de cada tema lleva a la lección donde se explica.</p>
      ${PARCIALES.map((u) => `<section class="seccion-parcial" data-u="${u.id}">${cabeza(u)}
        ${conFormulas(u).map((m) => `<h3><a href="#/${leccionesDe(m.id)[0].id}">Tema ${m.tema}: ${m.title}</a></h3>
          <dl class="fichas">${FORMULAS.filter((f) => f.m === m.id).map((f) => `<div class="ficha"><dt>${f.n}</dt><dd><span class="f">${f.f}</span>${f.d ? `<small>${f.d}</small>` : ''}</dd></div>`).join('')}</dl>`).join('')}
      </section>`).join('')}
    </article>`;
}

export function vistaCuadros(main) {
  document.title = 'Cuadros de Blanco, Economizar';
  const investigacion = EJERCICIOS.filter(({ ex }) => ex.research).sort((a, b) => a.ex.official.localeCompare(b.ex.official, 'es', { numeric: true }));
  main.innerHTML = `
    <article class="lesson cuadros-page">
      <h1>Cuadros de Blanco e investigación</h1>
      <p class="tldr">Los ${CUADROS.length} <mark>cuadros grises</mark> de Blanco, donde el libro resume cada concepto en pocas líneas: son las definiciones que se esperan en el parcial. Al final, los ${investigacion.length} puntos de investigación de los TP desarrollados con sus fuentes.</p>
      ${PARCIALES.map((u) => `<section class="seccion-parcial" data-u="${u.id}">${cabeza(u)}
        ${MODULOS.filter((m) => m.unit === u.id && CUADROS.some((c) => leccion(c.l)?.module === m.id)).map((m) => `<h3>Tema ${m.tema}: ${m.title}</h3>
          ${leccionesDe(m.id).filter((l) => l.cuadros).map((l) => `<p class="q-link"><a href="#/${l.id}">${l.title}</a></p>${l.cuadros.map(cuadroGris).join('')}`).join('')}`).join('')}
      </section>`).join('')}
      <section id="investigacion"><h2>Puntos de investigación de los TP</h2>
        <p class="sec-lede">Noticias, informes y datos que piden los prácticos, con la fuente, los conceptos de la materia y una opinión de ejemplo.</p>
        <ul class="investigacion">${investigacion.map(({ l, ex }) => `<li><a href="#/${l.id}"><b>TP ${ex.official.replace('.', ', ejercicio ')}</b>${ex.title}</a><small>Tema ${modulo(l.module).tema}</small></li>`).join('')}</ul>
      </section>
    </article>`;
}

// Parciales reales: cada pregunta con su resolución, lo que más se repite y qué temas pesan más
export function vistaParciales(main) {
  document.title = 'Parciales resueltos, Economizar';
  const tomados = EJERCICIOS.filter(({ ex }) => ex.exam);
  const total = tomados.reduce((n, { ex }) => n + ex.exam.length, 0);
  const repetidas = tomados.filter(({ ex }) => ex.exam.length > 1).sort((a, b) => b.ex.exam.length - a.ex.exam.length);
  const porTema = MODULOS.map((m) => ({ m, k: tomados.filter(({ l }) => l.module === m.id).reduce((n, { ex }) => n + ex.exam.length, 0) })).filter((x) => x.k).sort((a, b) => b.k - a.k);
  const maxK = porTema[0]?.k || 1;
  const pregunta = (e, [n, texto]) => {
    const hit = tomados.find(({ ex }) => ex.exam.includes(`${e.id}#${n}`));
    return `<details class="exam-q"><summary><span class="exam-n">${n}</span><span>${texto}${hit ? `<small>Tema ${modulo(hit.l.module).tema}</small>` : ''}</span></summary>
      ${hit ? `${ejercicios([hit.ex])}<p class="q-link"><a href="#/${hit.l.id}">Ver la teoría: “${hit.l.title}”</a></p>` : '<p class="sec-lede">Sin resolución cargada.</p>'}</details>`;
  };
  const grupos = [...PARCIALES, { id: 'int', title: 'Recuperatorios', name: 'Recuperatorios e integrales' }];
  main.innerHTML = `
    <article class="lesson parciales-page">
      <h1>Parciales resueltos</h1>
      <p class="tldr">Los ${PARCIALES_REALES.length} parciales y recuperatorios de la cátedra que tenemos, pregunta por pregunta y resueltos como se espera en el examen. Muchas preguntas salen textuales de Blanco y de los TP: por eso conviene empezar por las que <mark>se repiten</mark>.</p>
      <h2>Qué temas pesan más</h2>
      <ol class="peso">${porTema.map(({ m, k }) => `<li data-u="${m.unit}"><a href="#/${leccionesDe(m.id)[0].id}">Tema ${m.tema}: ${m.title}</a><span class="peso-barra" style="--w:${(k / maxK) * 100}%"></span><span class="peso-n">${k}</span></li>`).join('')}</ol>
      <p class="sec-lede">Preguntas por tema, sobre ${total} en total.</p>
      <h2>Lo que más se repite</h2>
      <ol class="repetidas">${repetidas.map(({ ex, l }) => `<li><span class="rep-n">${ex.exam.length} veces</span><span><a href="#/${l.id}">${ex.title}</a><small>Tema ${modulo(l.module).tema}: ${[...new Set(ex.exam.map((k) => examenDe(k)?.short))].join(', ')}</small></span></li>`).join('')}</ol>
      ${grupos.map((u) => { const lista = PARCIALES_REALES.filter((e) => e.unit === u.id); return lista.length ? `<section class="seccion-parcial" data-u="${u.id}">${cabeza(u)}
        ${lista.map((e) => `<details class="exam-block"><summary><b>${e.title}</b><span>${e.sub}, ${e.items.length} preguntas</span></summary>
          <div class="exam-body">${e.note ? `<p class="sec-lede">${e.note}</p>` : ''}${e.items.map((it) => pregunta(e, it)).join('')}</div></details>`).join('')}</section>` : ''; }).join('')}
    </article>`;
  // Las preguntas de parcial no montan laboratorios: las gráficas están en la lección
  main.querySelectorAll('.lab-mount').forEach((el) => el.remove());
}

// Apuntes en PDF que compartieron otros estudiantes (se sirven tal cual desde apuntes/)
const APUNTES = [
  ['apuntes/juana-vicente-apuntes.pdf', 'Apuntes de clase', '49 páginas. Desde la primera clase (condiciones de aprobación y programa) clase por clase.', '2,8 MB'],
  ['apuntes/juana-vicente-resumen.pdf', 'Resumen: primer y segundo parcial', '47 páginas. De qué es la economía, escasez y oferta y demanda a dinero, Banco Central, PIB, inflación, desigualdad y pobreza.', '2,9 MB'],
];

export function vistaApuntes(main) {
  document.title = 'Apuntes, Economizar';
  main.innerHTML = `
    <article class="lesson apuntes">
      <h1>Apuntes de Juana Vicente</h1>
      <p class="tldr">Los apuntes de clase y el resumen de los dos parciales que armó <b>Juana Vicente</b> cursando Economía en 2026, y que compartió para esta guía. Ante cualquier diferencia, valen la cátedra y las lecciones de la guía. ¡Gracias, Juana!</p>
      <ul class="guias">${APUNTES.map(([h, t, d, peso]) => `<li><a href="${h}" target="_blank" rel="noopener"><b>${t}</b><span>${d}</span></a><a class="guia-repo" href="${h}" download>Descargar PDF (${peso})</a></li>`).join('')}</ul>
    </article>`;
}
