/* ============================================================
   Lógica de la web
   - muestra de pantallas
   - cuestionario
   - envío a Formspree (con cola de seguridad)
   ============================================================ */

(function () {
  'use strict';

  var CONFIG = window.CONFIG;
  var SCREENS = window.SCREENS;

  var STORAGE_KEY = 'gabriela-pendientes';
  var screens = Array.prototype.slice.call(document.querySelectorAll('[data-screen]'));
  var quizEl = document.getElementById('quiz');
  var counterEl = document.getElementById('quiz-counter');

  var current = { index: 0, locked: false, answered: 0 };

  /* ---------------- pantallas ---------------- */

  function show(name) {
    screens.forEach(function (screen) {
      var active = screen.getAttribute('data-screen') === name;
      screen.hidden = !active;
      screen.classList.toggle('is-active', active);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var heading = document.querySelector('[data-screen="' + name + '"] h1, [data-screen="' + name + '"] .quiz__line');
    if (heading) {
      window.setTimeout(function () {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }, 60);
    }
  }

  /* ---------------- cuestionario ---------------- */

  function render(screen) {
    var card = document.createElement('div');
    card.className = 'quiz__card';
    card.style.setProperty('--chaos', String(screen.chaos || 0));

    var lines = document.createElement('div');
    lines.className = 'quiz__lines';

    screen.lines.forEach(function (text, i) {
      var line = document.createElement('p');
      line.className = 'quiz__line';
      line.textContent = text;
      line.style.animationDelay = Math.min(i * 110, 900) + 'ms';
      lines.appendChild(line);
    });

    var buttons = document.createElement('div');
    buttons.className = 'quiz__buttons' + (screen.buttons.length > 2 ? ' quiz__buttons--crowded' : '');

    screen.buttons.forEach(function (option, i) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'button button--' + (option.tone || (option.answer === 'SÍ' ? 'yes' : 'no'));
      button.textContent = option.label;
      button.style.animationDelay = Math.min(200 + i * 45, 700) + 'ms';
      button.addEventListener('click', function () {
        answer(screen, option.answer);
      });
      buttons.appendChild(button);
    });

    card.appendChild(lines);
    card.appendChild(buttons);
    quizEl.replaceChildren(card);

    counterEl.textContent =
      screen.final
        ? 'la última'
        : 'pregunta ' + (current.answered + 1) + ' · de ' + SCREENS.length;

    if (screen.chaos >= 0.78 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      card.classList.add('is-shaking');
    }
  }

  function answer(screen, answerValue) {
    if (current.locked) return;
    current.locked = true;

    // Bloqueo inmediato de la interfaz: evita dobles pulsaciones y dobles envíos.
    var buttons = quizEl.querySelectorAll('button');
    Array.prototype.forEach.call(buttons, function (button) {
      button.disabled = true;
    });

    current.answered += 1;

    send(buildRecord(screen, answerValue));

    if (screen.final) {
      window.setTimeout(function () {
        show('final');
      }, 420);
      return;
    }

    if (!screen.final && answerValue === 'NO' && screen.onNo) {
      renderPause(screen.onNo);
      return;
    }

    window.setTimeout(next, 320);
  }

  function next() {
    current.locked = false;
    current.index += 1;
    if (current.index >= SCREENS.length) {
      show('final');
      return;
    }
    render(SCREENS[current.index]);
  }

  function renderPause(pause) {
    var card = document.createElement('div');
    card.className = 'quiz__card';
    card.style.setProperty('--chaos', '0.9');

    var lines = document.createElement('div');
    lines.className = 'quiz__lines';

    var timers = [];
    pause.lines.forEach(function (text, i) {
      timers.push(
        window.setTimeout(function () {
          var line = document.createElement('p');
          line.className = 'quiz__line';
          line.textContent = text;
          lines.appendChild(line);
        }, 260 + i * 850)
      );
    });

    card.appendChild(lines);
    quizEl.replaceChildren(card);
    counterEl.textContent = '…';

    timers.push(
      window.setTimeout(function () {
        current.locked = false;
        current.index += 1;
        if (current.index >= SCREENS.length) {
          show('final');
          return;
        }
        render(SCREENS[current.index]);
      }, 260 + pause.lines.length * 850 + (pause.pause || 800))
    );
  }

  /* ---------------- Formspree ---------------- */

  function buildRecord(screen, answerValue) {
    var isFinal = Boolean(screen.final);
    return {
      respuesta: answerValue,
      mensaje: isFinal ? CONFIG.finalMessage(answerValue) : CONFIG.jokeMessage(answerValue),
      intento: screen.intento,
      pantalla: screen.id,
      nota: screen.nota,
      fase: isFinal ? 'pregunta real' : 'broma',
      es_final: isFinal ? 'sí' : 'no',
      intento_definitivo: isFinal ? 'sí' : 'no',
      numero_pregunta: current.answered,
      momento: new Date().toLocaleString('es-ES'),
      sitio: window.location.hostname,
    };
  }

  function queue() {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (error) {
      return [];
    }
  }

  function saveQueue(list) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
      /* sin almacenamiento: no pasa nada */
    }
  }

  var sending = false;

  function flush() {
    if (sending) return;
    var pending = queue();
    if (!pending.length || !CONFIG.formspreeEndpoint) return;

    sending = true;
    var record = pending.shift();
    saveQueue(pending);

    fetch(CONFIG.formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(record),
      keepalive: true,
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Formspree respondió ' + response.status);
        sending = false;
        window.setTimeout(flush, 300);
      })
      .catch(function () {
        // Si falla, la respuesta vuelve a la cola: nunca se pierde.
        saveQueue(queue().concat([record]));
        sending = false;
        window.setTimeout(flush, 8000);
      });
  }

  function send(record) {
    saveQueue(queue().concat([record]));
    flush();
  }

  window.addEventListener('online', flush);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) flush();
  });
  window.setInterval(flush, 20000);

  /* ---------------- inicio ---------------- */

  document.querySelectorAll('[data-action]').forEach(function (button) {
    button.addEventListener('click', function () {
      var action = button.getAttribute('data-action');
      if (action === 'empezar') show('carta');
      if (action === 'preguntar') {
        current.index = 0;
        current.locked = false;
        current.answered = 0;
        show('cuestionario');
        render(SCREENS[0]);
      }
    });
  });
})();