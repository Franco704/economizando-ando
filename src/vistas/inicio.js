// Portada: un mercado que se mueve con el dedo; después, los dos parciales con el avance de cada tema.
import { $ } from '../nucleo/dom.js';
import { plot, num } from '../temario/redaccion.js';
import { PARCIALES, MODULOS, LECCIONES, PREGUNTAS, PREGUNTAS_INTEGRAL, PARCIALES_REALES, INTEGRAL, CUADROS, EJERCICIOS, leccionesDe } from '../temario/indice.js';
import { hechas, hechasDe, aciertos, paraRepasar, siguienteLeccion } from '../estudio/progreso.js';
import { OTRAS_GUIAS } from '../estudio/otras-guias.js';
import { barras } from '../ui/barras.js';
import { icono } from '../ui/iconos.js';

const REPO = 'https://github.com/Franco704/economizar';

// Demanda D = 9 + k − 0,8X (k = cambio en la renta) y oferta O = 1 + 0,8X: el equilibrio se calcula, no se dibuja a ojo.
function mercado(k, anim) {
  const x = (8 + k) / 1.6, p = 1 + 0.8 * x;
  const curvas = [{ f: (X) => 1 + 0.8 * X, cls: 'c-s', label: 'O' }, { f: (X) => 9 + k - 0.8 * X, cls: 'c-d', label: k ? 'D′' : 'D' }];
  if (k) curvas.unshift({ f: (X) => 9 - 0.8 * X, cls: 'c-d', ghost: true, label: 'D' });
  return {
    svg: plot({ x: [0, 10], y: [0, 10], w: 400, h: 300, anim, xl: 'X', yl: 'P', alt: `Oferta y demanda: equilibrio en X = ${num(x)}, P = ${num(p)}`,
      curves: curvas, points: [{ x, y: p, cls: 'c-eq', label: k ? 'E′' : 'E' }], guides: [{ x, y: p, xt: 'X*', yt: 'P*' }] }),
    x, p,
  };
}
const RENTA = { '-2': 'cae mucho', '-1': 'cae', 0: 'sin cambios', 1: 'sube', 2: 'sube mucho' };

function filaTema(m) {
  const total = leccionesDe(m.id).length, h = hechasDe(m.id), a = aciertos(m.id);
  return `<li><a class="mod" href="#/${leccionesDe(m.id)[0].id}">
    <span class="mod-tag">Tema ${m.tema}</span>
    <span class="mod-tit">${m.title}</span>
    <span class="mod-blurb">${m.blurb[0].toUpperCase()}${m.blurb.slice(1)}.</span>
    <span class="mod-estado">${barras(h, total)}<small>${h === total ? 'Completo' : h ? `${h} de ${total} lecciones` : `${total} lecciones`}${a != null ? `, ${a} % de aciertos` : ''}</small></span>
  </a></li>`;
}

export function vistaInicio(main) {
  document.title = 'Economizar, guía de Economía';
  const sigue = siguienteLeccion();
  const nLabs = LECCIONES.reduce((n, l) => n + (l.labs?.length || 0), 0);
  const nPx = EJERCICIOS.filter(({ ex }) => ex.exam).length;
  const repasar = paraRepasar().length;
  const flojo = MODULOS.map((m) => ({ m, s: aciertos(m.id) })).filter((x) => x.s != null && x.s < 70).sort((a, b) => a.s - b.s)[0];
  const inicial = mercado(0, true);

  main.innerHTML = `
    <article class="inicio">
      <section class="hero">
        <div class="hero-texto">
          <p class="hero-materia">Economía 2026, UTN-FRT. Cátedra Ing. Ramón A. Aranda</p>
          <h1>Economía con las curvas en la mano</h1>
          <p class="lede">En los parciales lo que más puntaje suma son las gráficas. Acá se mueven: ${LECCIONES.length} lecciones, ${nLabs} laboratorios, ${PREGUNTAS.length} preguntas de repaso y los TP resueltos paso a paso, más ${nPx} preguntas de ${PARCIALES_REALES.length} parciales reales de la cátedra.</p>
          <div class="hero-acciones">
            <a class="btn primary" href="#/${sigue.id}">${hechas.size ? 'Seguir con' : 'Empezar con'} “${sigue.title}”</a>
            ${repasar ? `<a class="btn" href="#/repaso">Repasar ${repasar} ${repasar === 1 ? 'pregunta fallada' : 'preguntas falladas'}</a>` : '<a class="btn" href="#/parciales">Ver los parciales resueltos</a>'}
          </div>
          ${flojo ? `<p class="flojo">Tu punto más flojo por ahora es <a href="#/quiz/${flojo.m.id}">${flojo.m.title}</a>, con ${flojo.s} % de aciertos.</p>` : ''}
        </div>
        <figure class="pizarra">
          <div class="pizarra-grafico">${inicial.svg}</div>
          <label class="pizarra-control"><span>Renta de los consumidores (bien normal): <b data-renta>${RENTA[0]}</b></span>
            <input type="range" min="-2" max="2" step="1" value="0" aria-describedby="pizarraLectura" /></label>
          <figcaption id="pizarraLectura" aria-live="polite"></figcaption>
        </figure>
      </section>

      ${PARCIALES.map((u) => `
        <section class="parcial" data-u="${u.id}" aria-labelledby="t-${u.id}">
          <header class="parcial-cabeza">
            <h2 id="t-${u.id}">${u.name}<span>${u.title}</span></h2>
            <a class="btn sm" href="#/simulacro/${u.id}">Simulacro: ${Math.min(20, PREGUNTAS.filter((q) => MODULOS.find((m) => m.id === q.module).unit === u.id).length)} preguntas</a>
          </header>
          <ul class="mods">${MODULOS.filter((m) => m.unit === u.id).map(filaTema).join('')}</ul>
        </section>`).join('')}

      <section class="practica" aria-labelledby="t-practica">
        <h2 id="t-practica">Para el parcial</h2>
        <ul>
          ${[
            ['#/parciales', 'parciales', 'Parciales resueltos', `${PARCIALES_REALES.length} parciales y recuperatorios reales, pregunta por pregunta, y lo que más se repite.`],
            ['#/graficas', 'grafica', 'Taller de gráficas', 'Todas las gráficas interactivas juntas, para predecir y comprobar.'],
            ['#/integral', 'integral', 'Integral', `${Math.min(25, PREGUNTAS_INTEGRAL.length)} preguntas que cruzan temas y ${INTEGRAL.cases.length} problemas, con reloj de 120 minutos.`],
            ['#/formulas', 'formula', 'Fórmulas', 'Todo lo que hay que saber calcular, tema por tema.'],
            ['#/cuadros', 'cuadro', 'Cuadros de Blanco', `Los ${CUADROS.length} cuadros grises del libro y los puntos de investigación de los TP.`],
            ['#/repaso', 'repasar', 'Repasar', 'Las preguntas que fallaste, hasta que las aciertes.'],
          ].map(([h, i, t, d]) => `<li><a href="${h}">${icono(i, 22)}<span><b>${t}</b>${d}</span></a></li>`).join('')}
        </ul>
      </section>

      <section class="como" aria-labelledby="t-como">
        <h2 id="t-como">Cómo estudiar con esta guía</h2>
        <ol>
          <li>Leé la teoría de cada lección en orden: cada tema se apoya en el anterior.</li>
          <li>Antes de mover un deslizador, anticipá qué curva se desplaza y hacia dónde. Así se entrena el parcial.</li>
          <li>Respondé las preguntas del final. Las que falles van a <a href="#/repaso">Repasar</a>.</li>
          <li>Resolvé los ejercicios de los TP con lápiz y papel, dibujando la gráfica, antes de mirar la solución.</li>
          <li>Antes de cada parcial: los <a href="#/parciales">parciales reales</a>, el simulacro y la hoja de <a href="#/formulas">fórmulas</a>. Para el recuperatorio, el <a href="#/integral">integral</a>.</li>
        </ol>
        <p class="atajos">Atajos de teclado: <kbd>←</kbd> y <kbd>→</kbd> para moverte entre lecciones, <kbd>/</kbd> para buscar.</p>
      </section>

      <section class="otras" aria-labelledby="t-otras">
        <div class="repo">
          <div><h2>El código está abierto</h2><p>Si encontrás un error o querés proponer una pregunta, abrí un issue en el repositorio.</p></div>
          <a class="btn" href="${REPO}" target="_blank" rel="noopener">Ver el repositorio en GitHub</a>
        </div>
        <h2 id="t-otras">Otras guías de la UTN</h2>
        ${OTRAS_GUIAS.map((g) => `<h3>${g.anio}</h3><ul class="guias">${g.guias.map(([n, d, slug]) => `<li><a href="https://franco704.github.io/${slug}/" target="_blank" rel="noopener"><b>${n}</b><span>${d}</span></a><a class="guia-repo" href="https://github.com/Franco704/${slug}" target="_blank" rel="noopener" aria-label="Repositorio de ${n}">Repositorio</a></li>`).join('')}</ul>`).join('')}
      </section>
    </article>`;

  const grafico = $('.pizarra-grafico', main), lectura = $('#pizarraLectura', main);
  const leer = (k, r) => { lectura.innerHTML = k ? `La demanda se desplaza a la ${k > 0 ? 'derecha' : 'izquierda'}: el nuevo equilibrio es X* = <b>${num(r.x)}</b>, P* = <b>${num(r.p)}</b>. ${k > 0 ? 'Suben' : 'Bajan'} el precio y la cantidad.` : `Equilibrio: X* = <b>${num(r.x)}</b>, P* = <b>${num(r.p)}</b>. Mové la renta y mirá qué curva se desplaza.`; };
  leer(0, inicial);
  $('.pizarra input', main).addEventListener('input', (e) => {
    const k = +e.target.value, r = mercado(k, false);
    grafico.innerHTML = r.svg;
    $('[data-renta]', main).textContent = RENTA[k];
    leer(k, r);
  });
}
