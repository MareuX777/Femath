// ------------------------------
// --- MENU E EASTER EGG ---
// ------------------------------
const cornerIcon = document.getElementById('cornerIcon');
const floatingMenu = document.getElementById('floatingMenu');
const hoverSound = new Audio("coisas/hit.mp3");
hoverSound.volume = 0.25;

// Hover e clique no ícone do canto
cornerIcon.addEventListener('mouseenter', () => {
  hoverSound.currentTime = 0;
  hoverSound.play().catch(() => {});
  cornerIcon.src = "coisas/astolfoporcima.png";
});
cornerIcon.addEventListener('mouseleave', () => cornerIcon.src = "coisas/astolfo.png");
cornerIcon.addEventListener('click', () => floatingMenu.classList.toggle('show'));

// Botão fechar do menu
document.querySelector('.menu-close').addEventListener('click', () => floatingMenu.classList.remove('show'));

// Easter Egg
const easterEggBtn = document.getElementById('easterEggBtn');
const easterEggOverlay = document.getElementById('easterEggOverlay');
easterEggBtn.addEventListener('click', () => {
  easterEggOverlay.style.pointerEvents = 'auto';
  easterEggOverlay.style.opacity = '1';
  setTimeout(() => {
    easterEggOverlay.style.opacity = '0';
    easterEggOverlay.style.pointerEvents = 'none';
  }, 3000);
  unlockEasterEgg();
});

// ------------------------------
// --- ÁUDIO DE FUNDO ---
// ------------------------------
const audio = document.getElementById('bgAudio');
const muteBtn = document.getElementById('muteBtn');
audio.play().catch(() => {});

function updateMuteUI() {
  muteBtn.textContent = audio.muted ? '🔈 Mudo' : '🔊 Som';
}

muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  if (!audio.paused && !audio.muted) return updateMuteUI();
  if (!audio.muted) audio.play().catch(() => {});
  updateMuteUI();
});

updateMuteUI();

// ------------------------------
// --- CALCULADORA ---
// ------------------------------
(function () {
  const display = document.getElementById('result');
  const history = document.getElementById('history');
  const keys = document.querySelectorAll('.key');
  let expr = '';
  let lastWasOp = false;

  const clickSound = new Audio("coisas/click.mp3");
  clickSound.volume = 0.25;
  function playClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }

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
    let safeExpr = expr.replace(/÷/g, '/').replace(/×/g, '*');
    safeExpr = safeExpr.replace(/[+\-*/]+$/,'');
    if (safeExpr === '') {
      display.textContent = 'ERRO';
      return;
    }

    try {
      const val = eval(safeExpr);
      if (typeof val !== 'number' || !isFinite(val) || isNaN(val)) {
        display.textContent = 'ERRO';
        return;
      }

      expr = (Math.round((val + Number.EPSILON) * 100000000) / 100000000).toString();
      lastWasOp = false;
      update();

      unlockFirstCalc();
      if (safeExpr.trim() === '53*0') unlockSuspeito();
      if (typeof checkNumeroSorte === 'function') checkNumeroSorte(expr);
    } catch (error) {
      display.textContent = 'ERRO';
      console.error(error);
    }
  }

  function clearAll() { expr = ''; lastWasOp = false; update(); }
  function back() {
    expr = expr.slice(0, -1);
    lastWasOp = /[+\-*/×÷]$/.test(expr);
    update();
  }
  function toggleNeg() {
    const m = expr.match(/(\d*\.?\d+)$/);
    if (m) {
      const num = m[1];
      const before = expr.slice(0, m.index);
      expr = num.startsWith('-') ? before + num.slice(1) : before + '(-' + num + ')';
      update();
    } else if (expr === '') { expr = '-'; update(); }
  }
  function dot() {
    const m = expr.match(/(\d*\.?\d+)$/);
    if (m) {
      if (m[1].includes('.')) return;
      expr += '.';
    } else expr += '0.';
    lastWasOp = false;
    update();
  }
  function percent() {
    const m = expr.match(/(\d*\.?\d+)$/);
    if (m) {
      const num = Number(m[1]);
      const before = expr.slice(0, m.index);
      expr = before + (num / 100);
      update();
    }
  }

  keys.forEach(k => {
    k.addEventListener('click', () => {
      playClick();
      const n = k.getAttribute('data-num');
      const a = k.getAttribute('data-action');
      if (n !== null) return pushDigit(n);
      if (a) {
        switch (a) {
          case 'clear': return clearAll();
          case 'back': return back();
          case 'percent': return percent();
          case 'dot': return dot();
          case 'neg': return toggleNeg();
          case '=': return calculate();
          default: return pushOp(a);
        }
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    const k = e.key;
    if (/^[0-9]$/.test(k)) { pushDigit(k); e.preventDefault(); return; }
    if (k === '.' || k === ',') { dot(); e.preventDefault(); return; }
    if (k === '+' || k === '-' || k === '*' || k === '/') { pushOp(k); e.preventDefault(); return; }
    if (k === 'Enter' || k === '=') { calculate(); e.preventDefault(); return; }
    if (k === 'Backspace') { back(); e.preventDefault(); return; }
    if (k === 'Delete' || k.toLowerCase() === 'c') { clearAll(); e.preventDefault(); return; }
    if (k === '%') { percent(); e.preventDefault(); return; }
    if (k.toLowerCase() === 'n') { toggleNeg(); e.preventDefault(); return; }
  });

  update();
})();

// ------------------------------
// --- CONQUISTAS ---
// ------------------------------
const achIcon = document.getElementById('achIcon');
const achPanel = document.getElementById('achPanel');
achIcon.addEventListener('click', () => achPanel.classList.toggle('show'));
document.querySelector('.ach-close').addEventListener('click', () => achPanel.classList.remove('show'));

const firstCalc = document.getElementById('ach-firstCalc');
const easterEggAch = document.getElementById('ach-easterEgg');
const suspeitoAch = document.getElementById('ach-suspeito');
const astolfoAch = document.getElementById('ach-astolfo');
const numeroSorteAch = document.getElementById('ach-numeroSorte');

let firstCalcDone = false, easterEggDone = false, suspeitoDone = false;
let astolfoHoverCount = 0, astolfoDone = false, numeroSorteDone = false;

// Funções de desbloqueio
function unlockFirstCalc(showPopup = true) {
  if (!firstCalcDone) {
    firstCalcDone = true;
    firstCalc.querySelector('.status').textContent = '✅';
    firstCalc.style.color = '#00aa00';
    if (showPopup) showAchievementPopup('Primeiro cálculo 💡');
    saveAchievements();
  }
}
function unlockNumeroSorte(showPopup = true) {
  if (!numeroSorteDone) {
    numeroSorteDone = true;
    numeroSorteAch.querySelector('.status').textContent = '✅';
    numeroSorteAch.style.color = '#00aa00';
    if (showPopup) showAchievementPopup('Número da sorte ✨');
    saveAchievements();
  }
}
function unlockEasterEgg(showPopup = true) {
  if (!easterEggDone) {
    easterEggDone = true;
    easterEggAch.querySelector('.status').textContent = '✅';
    easterEggAch.style.color = '#00aa00';
    if (showPopup) showAchievementPopup('Easter Egg 🥚');
    saveAchievements();
  }
}
function unlockSuspeito(showPopup = true) {
  if (!suspeitoDone) {
    suspeitoDone = true;
    suspeitoAch.querySelector('.status').textContent = '✅';
    suspeitoAch.style.color = '#00aa00';
    if (showPopup) showAchievementPopup('Suspeito 🕵️');
    saveAchievements();
  }
}
function unlockAstolfo(showPopup = true) {
  if (!astolfoDone) {
    astolfoDone = true;
    astolfoAch.querySelector('.status').textContent = '✅';
    astolfoAch.style.color = '#00aa00';
    if (showPopup) showAchievementPopup('Astolfo adorador 💖');
    saveAchievements();
  }
}
function checkNumeroSorte(resultStr) {
  try {
    if (numeroSorteDone) return;
    if (typeof resultStr !== 'string') resultStr = String(resultStr);
    if (resultStr.includes('7')) unlockNumeroSorte();
  } catch (e) {
    console.error('checkNumeroSorte error', e);
  }
}

// Astolfo adorador 💖
cornerIcon.addEventListener('mouseenter', () => {
  if (!astolfoDone) {
    astolfoHoverCount++;
    if (astolfoHoverCount >= 5) unlockAstolfo();
  }
});

// ------------------------------
// --- SALVAR / CARREGAR ---
// ------------------------------
function saveAchievements() {
  localStorage.setItem('achievements', JSON.stringify({
    firstCalcDone, easterEggDone, suspeitoDone,
    astolfoDone, numeroSorteDone
  }));
}
function loadAchievements() {
  const data = JSON.parse(localStorage.getItem('achievements'));
  if (!data) return;
  if (data.firstCalcDone) unlockFirstCalc(false);
  if (data.easterEggDone) unlockEasterEgg(false);
  if (data.suspeitoDone) unlockSuspeito(false);
  if (data.astolfoDone) unlockAstolfo(false);
  if (data.numeroSorteDone) unlockNumeroSorte(false);
}
loadAchievements();

// ------------------------------
// --- POP-UP BONITO ---
// ------------------------------
function showAchievementPopup(title) {
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.textContent = `🏆 Conquista desbloqueada: ${title}!`;
  document.body.appendChild(popup);

  const sound = new Audio('coisas/somdaconquista.mp3');
  sound.volume = 0.5;
  sound.play().catch(() => {});

  // força a entrada
  setTimeout(() => popup.classList.add('show'), 50);

  // depois de 2.6s, dispara a saída
  setTimeout(() => popup.classList.add('hide'), 2650);

  // remove depois da animação de saída (0.4s)
  setTimeout(() => popup.remove(), 3100);
}


// ------------------------------
// --- SOM E HOVER TROFÉU ---
// ------------------------------
const trofeuSound = new Audio("coisas/gold.mp3");
trofeuSound.volume = 0.25;
const trofeuIcon = document.getElementById('trofeuSound');

trofeuIcon.addEventListener('mouseenter', () => {
  trofeuSound.currentTime = 0;
  trofeuSound.play().catch(() => {});
  trofeuIcon.src = "coisas/baudotesouro.png";
});
trofeuIcon.addEventListener('mouseleave', () => {
  trofeuIcon.src = "coisas/trofeusf.png";
});
