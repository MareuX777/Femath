const cornerIcon = document.getElementById('cornerIcon');
const floatingMenu = document.getElementById('floatingMenu');
const hoverSound = new Audio("coisas/hit.mp3");
hoverSound.volume = 0.25;

cornerIcon.addEventListener('mouseenter', () => {
  hoverSound.currentTime = 0;
  hoverSound.play().catch(() => {});
  cornerIcon.src = "coisas/astolfoporcima.png";
});
cornerIcon.addEventListener('mouseleave', () => {
  cornerIcon.src = "coisas/astolfo.png";
});
cornerIcon.addEventListener('click', () => {
  floatingMenu.classList.toggle('show');
});
document.querySelector('.menu-close').addEventListener('click', () => {
  floatingMenu.classList.remove('show');
});

const easterEggBtn = document.getElementById('easterEggBtn');
const easterEggOverlay = document.getElementById('easterEggOverlay');
easterEggBtn.addEventListener('click', () => {
  easterEggOverlay.style.pointerEvents = 'auto';
  easterEggOverlay.style.opacity = '1';
  setTimeout(() => {
    easterEggOverlay.style.opacity = '0';
    easterEggOverlay.style.pointerEvents = 'none';
  }, 3000);
});

// --- Áudio de fundo ---
const audio = document.getElementById('bgAudio');
const muteBtn = document.getElementById('muteBtn');
audio.play().catch(() => {});
function updateMuteUI() {
  if (audio.muted) {
    muteBtn.textContent = '🔈 Mudo';
    muteBtn.setAttribute('aria-pressed', 'true');
  } else {
    muteBtn.textContent = '🔊 Som';
    muteBtn.setAttribute('aria-pressed', 'false');
  }
}
muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  if (!audio.paused && !audio.muted) return updateMuteUI();
  if (!audio.muted) audio.play().catch(() => {});
  updateMuteUI();
});
updateMuteUI();

// --- Lógica da calculadora ---
(function () {
  const display = document.getElementById('result');
  const history = document.getElementById('history');
  const keys = document.querySelectorAll('.key');

  let expr = '';
  let lastWasOp = false;

  function update() {
    display.textContent = expr === '' ? '0' : expr;
    history.textContent = expr === '' ? '\u00A0' : '';
  }

  function pushDigit(d) {
    expr += d;
    lastWasOp = false;
    update();
  }

  function pushOp(op) {
    if (expr === '' && op !== '-') return;
    if (lastWasOp) expr = expr.slice(0, -1) + op;
    else expr += op;
    lastWasOp = true;
    update();
  }

  function calculate() {
    if (expr === '') return;
    if (!/^[-+*/%0-9.()\s]+$/.test(expr)) {
      display.textContent = 'ERRO';
      return;
    }
    try {
      const safe = Function('return (' + expr.replace(/÷/g, '/').replace(/×/g, '*') + ')');
      const val = safe();
      expr = (Math.round((Number(val) + Number.EPSILON) * 100000000) / 100000000).toString();
      lastWasOp = false;
      update();
    } catch (e) {
      display.textContent = 'ERRO';
    }
  }

  function clearAll() {
    expr = '';
    lastWasOp = false;
    update();
  }

  function back() {
    if (expr.length > 0) {
      expr = expr.slice(0, -1);
      lastWasOp = /[+\-*/]$/.test(expr);
      update();
    }
  }

  function dot() {
    if (lastWasOp || expr === '') expr += '0.';
    else expr += '.';
    lastWasOp = false;
    update();
  }

  function percent() {
    const m = expr.match(/(\d*\.?\d+)$/);
    if (m) {
      const num = Number(m[1]);
      const replaced = (num / 100).toString();
      expr = expr.slice(0, m.index) + replaced;
      update();
    }
  }

  function toggleNeg() {
    const m = expr.match(/(\d*\.?\d+)$/);
    if (m) {
      const num = m[1];
      if (m.index === 0) {
        expr = num.startsWith('-') ? num.slice(1) : '-' + num;
      } else {
        const before = expr.slice(0, m.index);
        expr = num.startsWith('-') ? before + num.slice(1) : before + '(-' + num + ')';
      }
      update();
    } else if (expr === '') {
      expr = '-';
      update();
    }
  }

  // --- Som de clique estilo Minecraft ---
  const clickSound = new Audio("coisas/click.mp3");
  clickSound.volume = 0.25;
  function playClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }

  keys.forEach(k => {
    k.addEventListener('click', () => {
      playClick();
      const n = k.getAttribute('data-num');
      const a = k.getAttribute('data-action');
      if (n !== null) {
        pushDigit(n);
        return;
      }
      if (a) {
        switch (a) {
          case 'clear': clearAll(); break;
          case 'back': back(); break;
          case 'percent': percent(); break;
          case 'dot': dot(); break;
          case 'neg': toggleNeg(); break;
          case '=': calculate(); break;
          default: pushOp(a); break;
        }
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      pushDigit(e.key); playClick(); e.preventDefault();
    } else if (e.key === 'Enter' || e.key === '=') {
      calculate(); playClick(); e.preventDefault();
    } else if (e.key === 'Backspace') {
      back(); playClick();
    } else if (e.key === 'Escape') {
      clearAll(); playClick();
    } else if (e.key === '.') {
      dot(); playClick();
    } else if (['+', '-', '*', '/'].includes(e.key)) {
      pushOp(e.key); playClick();
    } else if (e.key === '%') {
      percent(); playClick();
    }
  });

  update();
})();

// Toggle painel
const achIcon = document.getElementById('achIcon');
const achPanel = document.getElementById('achPanel');
achIcon.addEventListener('click', () => achPanel.classList.toggle('show'));
document.querySelector('.ach-close').addEventListener('click', () => achPanel.classList.remove('show'));

// Sistema de conquistas
const firstCalc = document.getElementById('ach-firstCalc');
const easterEggAch = document.getElementById('ach-easterEgg');

let firstCalcDone = false;
let easterEggDone = false;

// Quando o usuário calcula algo pela primeira vez
function unlockFirstCalc() {
  if(!firstCalcDone){
    firstCalcDone = true;
    firstCalc.querySelector('.status').textContent = '✅';
    firstCalc.style.color = '#00aa00';
  }
}

// Quando o usuário ativa o Easter Egg
function unlockEasterEgg() {
  if(!easterEggDone){
    easterEggDone = true;
    easterEggAch.querySelector('.status').textContent = '✅';
    easterEggAch.style.color = '#00aa00';
  }
}

// Integração com seu sistema atual
// 1) Depois de calcular:
window.addEventListener('unlockFirstCalcEvent', unlockFirstCalc);


// 2) No Easter Egg:
easterEggBtn.addEventListener('click', unlockEasterEgg);
