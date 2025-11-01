// ======================================================
// === 🎀 CALCULADORA FEMBOY PIXEL — SCRIPT PRINCIPAL ===
// ======================================================

// ------------------------------
// --- MENU E EASTER EGG ---
// ------------------------------
const cornerIcon = document.getElementById('cornerIcon');
const floatingMenu = document.getElementById('floatingMenu');
const hoverSound = new Audio("assets/bebendo.mp3");
hoverSound.volume = 0.25;

if (cornerIcon) {
  cornerIcon.addEventListener('mouseenter', () => {
    hoverSound.currentTime = 0;
    hoverSound.play().catch(() => {});
    cornerIcon.src = "assets/astolfohalloween.png";
  });
  cornerIcon.addEventListener('mouseleave', () => cornerIcon.src = "assets/astolfo.png");
  cornerIcon.addEventListener('click', () => {
    if (floatingMenu) floatingMenu.classList.toggle('show');
    unlockAstolfoClicker();
  });
}
const menuClose = document.querySelector('.menu-close');
if (menuClose && floatingMenu) menuClose.addEventListener('click', () => floatingMenu.classList.remove('show'));

// Easter Egg
const easterEggBtn = document.getElementById('easterEggBtn');
const easterEggOverlay = document.getElementById('easterEggOverlay');
if (easterEggBtn && easterEggOverlay) {
  easterEggBtn.addEventListener('click', () => {
    easterEggOverlay.style.pointerEvents = 'auto';
    easterEggOverlay.style.opacity = '1';
    setTimeout(() => {
      easterEggOverlay.style.opacity = '0';
      easterEggOverlay.style.pointerEvents = 'none';
    }, 3000);
    unlockEasterEgg();
  });
}

// ------------------------------
// --- ÁUDIO DE FUNDO ---
// ------------------------------
const audio = document.getElementById('bgAudio');
const muteBtn = document.getElementById('muteBtn');
if (audio) audio.play().catch(() => {});

function updateMuteUI() {
  if (!muteBtn || !audio) return;
  muteBtn.textContent = audio.muted ? '🔈 Mudo' : '🔊 Som';
}
if (muteBtn && audio) {
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    if (!audio.paused && !audio.muted) return updateMuteUI();
    if (!audio.muted) audio.play().catch(() => {});
    updateMuteUI();
  });
  updateMuteUI();
}

// ------------------------------
// --- CALCULADORA ---
// ------------------------------
(function () {
  const display = document.getElementById('result');
  const history = document.getElementById('history');
  const keys = document.querySelectorAll('.key');
  let expr = '';
  let lastWasOp = false;

  const clickSound = new Audio("assets/click.mp3");
  clickSound.volume = 0.25;
  const playClick = () => { clickSound.currentTime = 0; clickSound.play().catch(() => {}); };

 const update = () => {
  if (!display) return;
  const maxLength = 13; // número máximo de caracteres que cabem sem estourar
  let shownExpr = expr;

  // Se o texto for muito grande, corta o início e adiciona "..."
  if (shownExpr.length > maxLength) {
    shownExpr = '...' + shownExpr.slice(-maxLength);
  }

  display.textContent = shownExpr === '' ? '0' : shownExpr;
  if (history) history.textContent = expr === '' ? '\u00A0' : '';
};


  const pushDigit = d => { expr += d; lastWasOp = false; update(); };
  const pushOp = op => {
    if (expr === '' && op !== '-') return;
    if (lastWasOp) expr = expr.slice(0, -1) + op;
    else expr += op;
    lastWasOp = true; update();
  };

  function calculate() {
    if (expr === '') return;
    let safeExpr = expr.replace(/÷/g, '/').replace(/×/g, '*').replace(/[+\-*/]+$/, '');
    if (safeExpr === '') { if (display) display.textContent = 'ERRO'; return; }

    try {
      const val = eval(safeExpr);
      if (typeof val !== 'number' || !isFinite(val) || isNaN(val)) { if (display) display.textContent = 'ERRO'; return; }

      expr = (Math.round((val + Number.EPSILON) * 1e8) / 1e8).toString();
      lastWasOp = false;
      update();

      unlockFirstCalc();
      if (safeExpr.trim() === '53*0') unlockSuspeito();
      if (typeof checkNumeroSorte === 'function') checkNumeroSorte(expr);
    } catch (err) {
      console.error(err);
      if (display) display.textContent = 'ERRO';
    }
  }

  const clearAll = () => { expr = ''; lastWasOp = false; update(); };
  const back = () => { expr = expr.slice(0, -1); lastWasOp = /[+\-*/×÷]$/.test(expr); update(); };
  const toggleNeg = () => {
    const m = expr.match(/(\d*\.?\d+)$/);
    if (m) {
      const num = m[1], before = expr.slice(0, m.index);
      expr = num.startsWith('-') ? before + num.slice(1) : before + '(-' + num + ')';
    } else if (expr === '') expr = '-';
    update();
  };
  const dot = () => {
    const m = expr.match(/(\d*\.?\d+)$/);
    if (m && !m[1].includes('.')) expr += '.';
    else if (!m) expr += '0.';
    lastWasOp = false; update();
  };
  const percent = () => {
    const m = expr.match(/(\d*\.?\d+)$/);
    if (m) { expr = expr.slice(0, m.index) + (Number(m[1]) / 100); update(); }
  };

  if (keys) keys.forEach(k => {
    k.addEventListener('click', () => {
      playClick();
      const n = k.getAttribute('data-num');
      const a = k.getAttribute('data-action');
      if (n !== null) return pushDigit(n);
      if (!a) return;
      switch (a) {
        case 'clear': return clearAll();
        case 'back': return back();
        case 'percent': return percent();
        case 'dot': return dot();
        case 'neg': return toggleNeg();
        case '=': return calculate();
        default: return pushOp(a);
      }
    });
  });

  document.addEventListener('keydown', e => {
    const k = e.key;
    if (/^[0-9]$/.test(k)) { pushDigit(k); e.preventDefault(); }
    else if (['.', ','].includes(k)) { dot(); e.preventDefault(); }
    else if (['+', '-', '*', '/'].includes(k)) { pushOp(k === '*' ? '×' : k === '/' ? '÷' : k); e.preventDefault(); }
    else if (['Enter', '='].includes(k)) { calculate(); e.preventDefault(); }
    else if (k === 'Backspace') { back(); e.preventDefault(); }
    else if (['Delete', 'c', 'C'].includes(k)) { clearAll(); e.preventDefault(); }
    else if (k === '%') { percent(); e.preventDefault(); }
    else if (k.toLowerCase() === 'n') { toggleNeg(); e.preventDefault(); }
  });

  update();
})();

// ------------------------------
// --- CONQUISTAS ---
// ------------------------------
const achIcon = document.getElementById('achIcon');
const achPanel = document.getElementById('achPanel');
if (achIcon && achPanel) achIcon.addEventListener('click', () => achPanel.classList.toggle('show'));
const achClose = document.querySelector('.ach-close');
if (achClose && achPanel) achClose.addEventListener('click', () => achPanel.classList.remove('show'));

const firstCalc = document.getElementById('ach-firstCalc');
const easterEggAch = document.getElementById('ach-easterEgg');
const suspeitoAch = document.getElementById('ach-suspeito');
const numeroSorteAch = document.getElementById('ach-numeroSorte');
const astolfoAch = document.getElementById('ach-astolfo');
const achLover = document.getElementById('ach-lover');

let firstCalcDone = false, easterEggDone = false, suspeitoDone = false;
let astolfoHoverCount = 0, astolfoDone = false, numeroSorteDone = false;
let astolfoKisserDone = false;

// helper seguro para atualizar status no DOM
function safeSetStatus(el) {
  if (!el) return;
  try {
    const s = el.querySelector('.status');
    if (s) s.textContent = '✅';
    el.style.color = '#00aa00';
  } catch (e) { console.error('safeSetStatus error', e); }
}

function unlockFirstCalc(show = true) { if (!firstCalcDone) { firstCalcDone = true; safeSetStatus(firstCalc); if (show) showAchievementPopup('Primeiro cálculo 💡'); saveAchievements(); } }
function unlockEasterEgg(show = true) { if (!easterEggDone) { easterEggDone = true; safeSetStatus(easterEggAch); if (show) showAchievementPopup('Easter Egg 🥚'); saveAchievements(); } }
function unlockSuspeito(show = true) { if (!suspeitoDone) { suspeitoDone = true; safeSetStatus(suspeitoAch); if (show) showAchievementPopup('Suspeito 🕵️'); saveAchievements(); } }
function unlockAstolfo(show = true) { if (!astolfoDone) { astolfoDone = true; safeSetStatus(astolfoAch); if (show) showAchievementPopup('Adorador do Astolfo 💖'); saveAchievements(); } }
function unlockAstolfoClicker(show = true) { if (!astolfoKisserDone) { astolfoKisserDone = true; safeSetStatus(achLover); if (show) showAchievementPopup('Femboy Kisser 😘'); saveAchievements(); } }
function unlockNumeroSorte(show = true) { if (!numeroSorteDone) { numeroSorteDone = true; safeSetStatus(numeroSorteAch); if (show) showAchievementPopup('Número da Sorte ✨'); saveAchievements(); } }

function checkNumeroSorte(resultStr) {
  try {
    if (numeroSorteDone) return;
    if (String(resultStr).includes('7')) unlockNumeroSorte();
  } catch (e) { console.error('checkNumeroSorte error', e); }
}

// exemplo: hover para Astolfo (5 hovers)
if (cornerIcon) {
  cornerIcon.addEventListener('mouseenter', () => {
    if (!astolfoDone) {
      astolfoHoverCount++;
      if (astolfoHoverCount >= 5) unlockAstolfo();
    }
  });
}

// ------------------------------
// --- SALVAR / CARREGAR --- 
// ------------------------------
function saveAchievements() {
  try {
    localStorage.setItem('achievements', JSON.stringify({
      firstCalcDone, easterEggDone, suspeitoDone,
      astolfoDone, numeroSorteDone, astolfoKisserDone
    }));
  } catch (e) {
    console.error('saveAchievements error', e);
  }
}
function loadAchievements() {
  try {
    const d = JSON.parse(localStorage.getItem('achievements'));
    if (!d) return;
    if (d.firstCalcDone) unlockFirstCalc(false);
    if (d.easterEggDone) unlockEasterEgg(false);
    if (d.suspeitoDone) unlockSuspeito(false);
    if (d.astolfoDone) unlockAstolfo(false);
    if (d.numeroSorteDone) unlockNumeroSorte(false);
    if (d.astolfoKisserDone) unlockAstolfoClicker(false);
  } catch (e) {
    console.error('loadAchievements error', e);
  }
}
loadAchievements();

// ------------------------------
// --- POP-UP DE CONQUISTA ---
// ------------------------------
function showAchievementPopup(title) {
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.textContent = `🏆 Conquista desbloqueada: ${title}!`;
  document.body.appendChild(popup);
  const sound = new Audio('assets/somdaconquista.mp3');
  sound.volume = 0.5; sound.play().catch(() => {});
  setTimeout(() => popup.classList.add('show'), 50);
  setTimeout(() => popup.classList.add('hide'), 2650);
  setTimeout(() => popup.remove(), 3100);
}

// ------------------------------
// --- TROFÉU (som + hover) ---
// ------------------------------
const trofeuSound = new Audio("assets/gold.mp3");
trofeuSound.volume = 0.25;
const trofeuIcon = document.getElementById('trofeuSound');
if (trofeuIcon) {
  trofeuIcon.addEventListener('mouseenter', () => {
    trofeuSound.currentTime = 0; trofeuSound.play().catch(() => {});
    trofeuIcon.src = "assets/baudotesouro.png";
  });
  trofeuIcon.addEventListener('mouseleave', () => trofeuIcon.src = "assets/trofeusf.png");
}

// ------------------------------
// --- MODO NOTURNO ---
// ------------------------------
const themeBtn = document.getElementById('themeBtn');
const darkLoader = document.getElementById('darkLoader');
const lightLoader = document.getElementById('lightLoader');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' && themeBtn) {
  document.body.classList.add('dark'); themeBtn.textContent = '☀️'; themeBtn.setAttribute('aria-pressed', 'true');
}
function showLoaderAndSwitch(loader, makeDark) {
  if (!loader) return;
  loader.classList.add('show');
  setTimeout(() => {
    if (makeDark) {
      document.body.classList.add('dark'); if (themeBtn) { themeBtn.textContent = '☀️'; themeBtn.setAttribute('aria-pressed', 'true'); }
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark'); if (themeBtn) { themeBtn.textContent = '🌙'; themeBtn.setAttribute('aria-pressed', 'false'); }
      localStorage.setItem('theme', 'light');
    }
    setTimeout(() => loader.classList.remove('show'), 800);
  }, 700);
}
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    isDark ? showLoaderAndSwitch(lightLoader, false) : showLoaderAndSwitch(darkLoader, true);
  });
}

// ------------------------------
// --- ASTOLFO FALANTE ---
// ------------------------------
const messages = [
  "Você é incrível. UwU",
  "Cuidado com o 53*0, ＞﹏＜",
  "O Astolfo acredita em você! o((>ω<))o",
  "Modo femboy ativado! :3"
];
setInterval(() => {
  const bubble = document.createElement('div');
  bubble.className = 'astolfo-bubble';
  bubble.textContent = messages[Math.floor(Math.random()*messages.length)];
  document.body.appendChild(bubble);
  setTimeout(() => bubble.remove(), 5000);
}, 20000);

// ------------------------------
// --- PARTÍCULAS DE FUNDO ---
// ------------------------------
const canvas = document.getElementById('bgParticles');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() { if (!canvas) return; canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
if (window && canvas) { window.addEventListener('resize', resizeCanvas); resizeCanvas(); }

function createParticles(n=70) {
  if (!canvas) return;
  particles = Array.from({length:n},() => ({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height,
    r:Math.random()*2+1, dx:(Math.random()-.5)*.7, dy:(Math.random()-.5)*.7
  }));
}
function drawParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const dark = document.body.classList.contains('dark');
  ctx.fillStyle = dark?'rgba(255,255,255,0.8)':'rgba(50,50,80,0.6)';
  for(let p of particles){
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    p.x+=p.dx; p.y+=p.dy;
    if(p.x<0||p.x>canvas.width)p.dx*=-1;
    if(p.y<0||p.y>canvas.height)p.dy*=-1;
  }
  requestAnimationFrame(drawParticles);
}
createParticles(); drawParticles();