/* =========================================================
   SCRIPT.JS — Romantic Countdown v2
   - Canvas particle system (hearts + petals)
   - Countdown with flip animation
   - Rotating romantic phrases with crossfade
   ========================================================= */

// ─── TARGET DATE ──────────────────────────────────────────
function getTargetDate() {
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, 10, 1, 0, 0, 0); // 1 Novembre
    if (now >= target) {
        target = new Date(year + 1, 10, 1, 0, 0, 0);
    }
    return target;
}

const TARGET = getTargetDate();

// ─── COUNTDOWN LOGIC ──────────────────────────────────────
const prevValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };

function pad(n) {
    return String(n).padStart(2, '0');
}

function triggerFlip(elementId) {
    const el = document.getElementById(elementId);
    el.classList.remove('flip');
    void el.offsetWidth; // reflow
    el.classList.add('flip');
}

function updateCountdown() {
    const now = new Date(); // Uses the device's local clock ✓
    const diff = TARGET - now;

    if (diff <= 0) {
        document.querySelector('.countdown-section').innerHTML =
            '<p style="font-family: var(--font-script); font-size: 3rem; color: #ffc8dd; text-shadow: 0 0 20px #ff6fa3;">Hoje é o dia da Isa! 🎂🎉</p>';
        return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const fields = [
        { id: 'days',    val: days },
        { id: 'hours',   val: hours },
        { id: 'minutes', val: minutes },
        { id: 'seconds', val: seconds },
    ];

    fields.forEach(({ id, val }) => {
        const el = document.getElementById(id);
        const padded = pad(val);
        if (val !== prevValues[id]) {
            el.textContent = padded;
            triggerFlip(id);
            prevValues[id] = val;
        }
    });
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ─── ROMANTIC PHRASES (rotate every 8s) ───────────────────
const phrases = [
    "Isa, o mundo fica mais bonito no dia em que você nasceu! 🌸",
    "Faltam só esses dias para celebrar a pessoa mais incrível que conheço! 🎉",
    "Todo o universo se preparando para o seu dia, Isa... e nós também! ✨",
    "Porque você merece uma festa que o tempo inteiro não esquece! 🎂",
    "Cada segundo que passa é um segundo a mais de felicidade chegando para você!",
    "Isa, você é daquelas pessoas que fazem qualquer dia valer a pena. 💕",
    "O 1° de Novembro vai ser épico — porque você é épica! 🌟",
    "Contando os dias, as horas, os minutos... só para poder te dar um abraço de aniversário! 🤗",
];

let phraseIndex = 0;
const phraseEl = document.getElementById('romanticPhrase');

function showPhrase() {
    phraseEl.classList.add('fade-out');
    setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        phraseEl.textContent = phrases[phraseIndex];
        phraseEl.classList.remove('fade-out');
    }, 1200);
}

// Init first phrase
phraseEl.textContent = phrases[0];
setInterval(showPhrase, 8000);

// ─── CANVAS PARTICLE SYSTEM ───────────────────────────────
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');

let W = 0, H = 0;

function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Particle class
class Particle {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x    = Math.random() * W;
        this.y    = initial ? Math.random() * H : -20;
        this.size = Math.random() * 14 + 4;
        this.speedY = Math.random() * 0.6 + 0.25;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.45 + 0.1;
        this.wobble  = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.025 + 0.008;
        // Randomly choose shape: heart or circle (petal)
        this.type = Math.random() > 0.45 ? 'heart' : 'petal';
        // Hue in rose/pink/violet range
        const hues = [340, 350, 10, 310, 280];
        this.hue = hues[Math.floor(Math.random() * hues.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
        this.wobble  += this.wobbleSpeed;
        this.x       += Math.sin(this.wobble) * 0.6 + this.speedX;
        this.y       += this.speedY;
        this.rotation += this.rotSpeed;

        if (this.y > H + 30) this.reset();
    }

    drawHeart(cx, cy, s) {
        ctx.beginPath();
        ctx.moveTo(cx, cy - s * 0.2);
        ctx.bezierCurveTo(cx, cy - s * 0.6, cx - s * 0.85, cy - s * 0.6, cx - s * 0.85, cy - s * 0.1);
        ctx.bezierCurveTo(cx - s * 0.85, cy + s * 0.35, cx - s * 0.35, cy + s * 0.7, cx, cy + s);
        ctx.bezierCurveTo(cx + s * 0.35, cy + s * 0.7, cx + s * 0.85, cy + s * 0.35, cx + s * 0.85, cy - s * 0.1);
        ctx.bezierCurveTo(cx + s * 0.85, cy - s * 0.6, cx, cy - s * 0.6, cx, cy - s * 0.2);
        ctx.closePath();
    }

    drawPetal(cx, cy, s) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, s * 0.4, s, 0, 0, Math.PI * 2);
        ctx.closePath();
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        grad.addColorStop(0, `hsla(${this.hue}, 90%, 85%, 1)`);
        grad.addColorStop(1, `hsla(${this.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = grad;

        if (this.type === 'heart') {
            this.drawHeart(0, 0, this.size * 0.55);
        } else {
            this.drawPetal(0, 0, this.size * 0.7);
        }
        ctx.fill();
        ctx.restore();
    }
}

// Create particles
const PARTICLE_COUNT = Math.min(80, Math.floor(W / 14));
const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
}

animateCanvas();
