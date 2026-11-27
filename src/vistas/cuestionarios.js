// Práctica con preguntas: cuestionario de un tema, simulacro de cada parcial, repaso de lo fallado e integral con reloj.
import { $, shuffle } from '../nucleo/dom.js';
import { PARCIALES, MODULOS, PREGUNTAS, PREGUNTAS_INTEGRAL, INTEGRAL, preguntaPorId, parcial, leccionesDe, modulo } from '../temario/indice.js';
import { montarCuestionario } from '../estudio/opcion-multiple.js';
import { ejercicios } from '../estudio/ejercicios.js';
import { respuestas, mejores, guardarMejor, paraRepasar, siguienteLeccion } from '../estudio/progreso.js';

// Primero las que fallaste, después las que nunca respondiste, al final las que acertaste
const peso = (q) => (respuestas[q.id]?.ok === false ? 0 : respuestas[q.id] ? 2 : 1);

export function vistaCuestionarioTema(main, m) {
  document.title = `Cuestionario: ${m.title}`;
  document.body.dataset.unit = m.unit;
  const pool = PREGUNTAS.filter((q) => q.module === m.id);
  const qs = shuffle(pool).sort((a, b) => peso(a) - peso(b)).slice(0, 15);
  main.innerHTML = `
    <article class="lesson quiz-page">
      <p class="crumb"><a href="#/${leccionesDe(m.id)[0].id}">Tema ${m.tema}, ${m.title}</a></p>
      <h1>Cuestionario del tema</h1>
      <p class="tldr">${qs.length} preguntas de las ${pool.length} del tema. Aparecen primero las que fallaste y las que nunca respondiste.${mejores[m.id] != null ? ` Tu mejor resultado: ${mejores[m.id]} %.` : ''}</p>
      <div class="quiz-mount"></div>
    </article>`;
  montarCuestionario($('.quiz-mount', main), qs, { mode: 'exam', onFinish: (pct) => guardarMejor(m.id, pct) });
}

export function vistaSimulacro(main, uid) {
  const u = parcial(uid);
  if (!u) { location.replace(`#/simulacro/${modulo(siguienteLeccion().module).unit}`); return; }
  document.title = `Simulacro del ${u.title.toLowerCase()}, Economizando Ando`;
  document.body.dataset.unit = u.id;
  const mods = MODULOS.filter((m) => m.unit === u.id);
  // Reparte las preguntas entre los temas para que ninguno domine
  const porTema = mods.map((m) => shuffle(PREGUNTAS.filter((q) => q.module === m.id))).filter((a) => a.length);
  const qs = [];
  for (let i = 0; qs.length < 20 && porTema.some((a) => a[i]); i++) porTema.forEach((a) => a[i] && qs.length < 20 && qs.push(a[i]));
  main.innerHTML = `
    <article class="lesson quiz-page">
      <nav class="filtro" aria-label="Elegir el simulacro">${PARCIALES.map((x) => `<a class="btn sm" data-u="${x.id}" href="#/simulacro/${x.id}"${x === u ? ' aria-current="page"' : ''}>${x.title}</a>`).join('')}<a class="btn sm" data-u="int" href="#/integral">Integral</a></nav>
      <h1>Simulacro del ${u.title.toLowerCase()}</h1>
      <p class="tldr">${qs.length} preguntas mezcladas de ${u.name} (temas ${mods.map((m) => m.tema).join(', ')}). Respondé todas y corregí al final, como en el parcial. En el examen real además vas a tener que <mark>graficar</mark>: practicalo en el <a href="#/graficas">taller de gráficas</a>.</p>
      <div class="quiz-mount"></div>
    </article>`;
  montarCuestionario($('.quiz-mount', main), shuffle(qs), { mode: 'exam' });
}

export function vistaRepaso(main) {
  document.title = 'Repasar, Economizando Ando';
  const qs = paraRepasar().map((id) => preguntaPorId[id]);
  main.innerHTML = `
    <article class="lesson quiz-page">
      <h1>Repasar</h1>
      ${qs.length ? `<p class="tldr">${qs.length === 1 ? 'Esta es la pregunta que respondiste mal' : `Estas son las ${qs.length} preguntas que respondiste mal`} la última vez. Cuando aciertes una, sale de la lista.</p><div class="quiz-mount"></div>`
        : `<p class="tldr">No tenés preguntas pendientes. Cada vez que falles una, en una lección, un cuestionario o un simulacro, aparece acá para que la vuelvas a intentar.</p>
           <p class="acciones"><a class="btn primary" href="#/simulacro/p1">Simulacro del primer parcial</a><a class="btn" href="#/simulacro/p2">Simulacro del segundo parcial</a><a class="btn" href="#/integral">Integral</a></p>`}
    </article>`;
  if (qs.length) montarCuestionario($('.quiz-mount', main), qs, { mode: 'review' });
}

// Integral: 25 preguntas difíciles de todo el año, problemas tipo parcial y 120 minutos. Devuelve la limpieza del reloj.
export function vistaIntegral(main) {
  document.title = 'Integral, Economizando Ando';
  document.body.dataset.unit = 'int';
  const qs = shuffle(PREGUNTAS_INTEGRAL).slice(0, 25);
  let reloj = null;
  const parar = () => { clearInterval(reloj); reloj = null; };
  main.innerHTML = `
    <article class="lesson quiz-page">
      <nav class="filtro" aria-label="Elegir el simulacro">${PARCIALES.map((x) => `<a class="btn sm" data-u="${x.id}" href="#/simulacro/${x.id}">${x.title}</a>`).join('')}<a class="btn sm" data-u="int" href="#/integral" aria-current="page">Integral</a></nav>
      <h1>Integral</h1>
      <p class="tldr">Como el recuperatorio integral de la cátedra: <mark>${qs.length} preguntas de Micro y Macro</mark>, elegidas al azar entre ${PREGUNTAS_INTEGRAL.length}, que cruzan temas y castigan las confusiones típicas. Después, ${INTEGRAL.cases.length} problemas como los del parcial, con gráfico y justificación.</p>
      <div class="note warn"><p><strong>Reglas.</strong> Tenés 120 minutos y aprobás con 60 %. En los problemas, una respuesta sin justificar o sin gráfico no suma: corregite con la grilla de cada solución. Varias opciones son “casi correctas”: buscá la que es correcta <em>siempre</em>, no la que suena mejor.</p></div>
      <div class="reloj-fila"><button class="btn primary" type="button" data-act="reloj">Empezar el reloj</button><span class="reloj" role="timer" aria-label="Tiempo restante" hidden>120:00</span></div>
      <section class="check-sec"><h2>Parte teórica</h2><div class="quiz-mount"></div></section>
      <section class="practice"><h2>Parte práctica</h2><p class="sec-lede">Resolvé cada problema en papel, completo y con los gráficos, antes de abrir la solución.</p>${ejercicios(INTEGRAL.cases.map((c, i) => ({ ...c, tag: `Problema ${i + 1}`, level: 3 })))}</section>
    </article>`;
  const mount = $('.quiz-mount', main);
  montarCuestionario(mount, qs, { mode: 'exam', from: false, onFinish: parar });
  $('[data-act="reloj"]', main).addEventListener('click', (e) => {
    e.currentTarget.remove();
    const t = $('.reloj', main);
    t.hidden = false;
    const fin = Date.now() + 120 * 60 * 1000;
    reloj = setInterval(() => {
      const queda = Math.max(0, fin - Date.now());
      t.textContent = `${String(Math.floor(queda / 60000)).padStart(2, '0')}:${String(Math.floor((queda % 60000) / 1000)).padStart(2, '0')}`;
      t.classList.toggle('poco', queda < 10 * 60 * 1000);
      if (!queda) { parar(); t.textContent = 'Tiempo cumplido'; $('[data-act="grade"]', mount)?.click(); }
    }, 1000);
  });
  return parar;
}
