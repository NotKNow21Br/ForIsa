/* =========================================================
   SCRIPT.JS — Birthday Countdown v4
   Vibe: Pink Friendship 🩷
   - Canvas: mini hearts + sparkle stars + petals (soft colors)
   - Countdown with flip animation (device local clock)
   - Rotating sweet birthday phrases for Isa
   ========================================================= */

// ─── TARGET DATE ──────────────────────────────────────────
function getTargetDate() {
    const now = new Date();
    let year  = now.getFullYear();
    let target = new Date(year, 10, 1, 0, 0, 0); // 1° Novembro
    if (now >= target) target = new Date(year + 1, 10, 1, 0, 0, 0);
    return target;
}

const TARGET = getTargetDate();

// ─── COUNTDOWN ────────────────────────────────────────────
const prev = { days: -1, hours: -1, minutes: -1, seconds: -1 };

function pad(n) { return String(n).padStart(2, '0'); }

function triggerFlip(id) {
    const el = document.getElementById(id);
    el.classList.remove('flip');
    void el.offsetWidth;
    el.classList.add('flip');
}

function updateCountdown() {
    const now  = new Date();   // ← relógio local do dispositivo ✓
    const diff = TARGET - now;

    if (diff <= 0) {
        document.querySelector('.countdown-section').innerHTML =
            '<p style="font-family:\'Dancing Script\',cursive;font-size:2.8rem;color:#f9a8d4;text-shadow:0 0 22px #f472b6;line-height:1.5">🩷 Hoje é o dia da Isa! 🎂✨</p>';
        return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000)  / 60000);
    const seconds = Math.floor((diff % 60000)    / 1000);

    [
        { id: 'days',    val: days },
        { id: 'hours',   val: hours },
        { id: 'minutes', val: minutes },
        { id: 'seconds', val: seconds },
    ].forEach(({ id, val }) => {
        if (val !== prev[id]) {
            document.getElementById(id).textContent = pad(val);
            triggerFlip(id);
            prev[id] = val;
        }
    });
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ─── BIRTHDAY PHRASES — amizade fofa 🩷 ───────────────────
const phrases = [
    "🩷 Isa, você é o tipo de pessoa que ilumina qualquer ambiente!",
    "🌸 Faltam só esses dias para o aniversário da minha amiga favorita!",
    "✨ Todo o universo vai brilhar mais no dia 1° de Novembro!",
    "🎂 Você merece todo o amor e felicidade do mundo, Isa!",
    "🌷 Ser sua amiga é um presente que ganho todo dia!",
    "🎀 Contando os segundos para poder te abraçar no seu dia!",
    "💫 Isa, você é especial de um jeito que as palavras não conseguem explicar!",
    "🩷 O 1° de Novembro vai ser tão lindo quanto você!",
];

let phraseIndex = 0;
const phraseEl  = document.getElementById('birthdayPhrase');

function showPhrase() {
    phraseEl.classList.add('fade-out');
    setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        phraseEl.textContent = phrases[phraseIndex];
        phraseEl.classList.remove('fade-out');
    }, 1100);
}

phraseEl.textContent = phrases[0];
setInterval(showPhrase, 8000);

// ─── CANVAS — mini hearts + stars + petals ────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let W = 0, H = 0;

function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Soft pink/lilac/gold palette
const COLORS = [
    '#f9a8d4', '#f472b6', '#e879f9',
    '#c084fc', '#fde68a', '#fdba74',
    '#ffffff',  '#fbcfe8',
];

class Particle {
    constructor(init = false) { this.reset(init); }

    reset(init = false) {
        this.x       = Math.random() * W;
        this.y       = init ? Math.random() * H : -20;
        this.size    = Math.random() * 12 + 4;
        this.speedY  = Math.random() * 0.65 + 0.2;
        this.speedX  = (Math.random() - 0.5) * 0.45;
        this.opacity = Math.random() * 0.50 + 0.12;
        this.color   = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.rotation  = Math.random() * Math.PI * 2;
        this.rotSpeed  = (Math.random() - 0.5) * 0.025;
        this.wobble    = Math.random() * Math.PI * 2;
        this.wobbleSpd = Math.random() * 0.018 + 0.006;
        // Mix of shapes: more hearts and flowers, fewer plain shapes
        const shapes = ['heart', 'heart', 'heart', 'star4', 'circle', 'petal'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    }

    update() {
        this.wobble   += this.wobbleSpd;
        this.x        += Math.sin(this.wobble) * 0.65 + this.speedX;
        this.y        += this.speedY;
        this.rotation += this.rotSpeed;
        if (this.y > H + 30) this.reset();
    }

    drawHeart(cx, cy, s) {
        ctx.beginPath();
        ctx.moveTo(cx, cy - s * 0.18);
        ctx.bezierCurveTo(cx, cy - s * 0.55, cx - s * 0.80, cy - s * 0.55, cx - s * 0.80, cy - s * 0.08);
        ctx.bezierCurveTo(cx - s * 0.80, cy + s * 0.32, cx - s * 0.30, cy + s * 0.65, cx, cy + s * 0.95);
        ctx.bezierCurveTo(cx + s * 0.30, cy + s * 0.65, cx + s * 0.80, cy + s * 0.32, cx + s * 0.80, cy - s * 0.08);
        ctx.bezierCurveTo(cx + s * 0.80, cy - s * 0.55, cx, cy - s * 0.55, cx, cy - s * 0.18);
        ctx.closePath();
    }

    drawStar4(cx, cy, r) {
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle  = (i * Math.PI) / 4 - Math.PI / 2;
            const radius = i % 2 === 0 ? r : r * 0.38;
            ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        }
        ctx.closePath();
    }

    drawPetal(cx, cy, s) {
        ctx.beginPath();
        ctx.ellipse(cx, cy - s * 0.3, s * 0.3, s * 0.65, 0, 0, Math.PI * 2);
        ctx.closePath();
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        // soft gradient fill
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, this.color + '00');
        ctx.fillStyle = grad;

        const s = this.size * 0.55;
        if      (this.shape === 'heart')  { this.drawHeart(0, 0, s); }
        else if (this.shape === 'star4')  { this.drawStar4(0, 0, s * 1.1); }
        else if (this.shape === 'petal')  { this.drawPetal(0, 0, s * 1.2); }
        else {
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
        }

        ctx.fill();
        ctx.restore();
    }
}

const COUNT = Math.min(85, Math.floor(W / 13));
const particles = Array.from({ length: COUNT }, () => new Particle(true));

function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

animate();
