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
    let year = now.getFullYear();
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
    const now = new Date();   // ← relógio local do dispositivo ✓
    const diff = TARGET - now;

    if (diff <= 0) {
        document.querySelector('.countdown-section').innerHTML =
            '<p style="font-family:\'Dancing Script\',cursive;font-size:2.8rem;color:#f9a8d4;text-shadow:0 0 22px #f472b6;line-height:1.5">🩷 Hoje é o dia da Isa! 🎂✨</p>';
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    [
        { id: 'days', val: days },
        { id: 'hours', val: hours },
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
    "🌷 Ser seu amigo é um presente que ganho todo dia!",
    "🎀 Contando os segundos para poder te abraçar no seu dia!",
    "💫 Isa, você é especial de um jeito que as palavras não conseguem explicar!",
    "🩷 O 1° de Novembro vai ser tão lindo quanto você!",
    "🩷 Eu não vejo a hora de te encontrar!!",
    "🩷 Vc é importante pra mim!!!",
    "🩷 Feliz aniversário antecipado!!",
    "🩷 Que seu dia seja repleto de alegria, paz e amor!",
    "🩷 rawr!",
    "🩷 Vc é muito especial pra mim",
];

let phraseIndex = 0;
const phraseEl = document.getElementById('birthdayPhrase');

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
const ctx = canvas.getContext('2d');
let W = 0, H = 0;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Soft pink/lilac/gold palette
const COLORS = [
    '#f9a8d4', '#f472b6', '#e879f9',
    '#c084fc', '#fde68a', '#fdba74',
    '#ffffff', '#fbcfe8',
];

class Particle {
    constructor(init = false) { this.reset(init); }

    reset(init = false) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : -20;
        this.size = Math.random() * 12 + 4;
        this.speedY = Math.random() * 0.65 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.opacity = Math.random() * 0.50 + 0.12;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.025;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpd = Math.random() * 0.018 + 0.006;
        // Mix of shapes: more hearts and flowers, fewer plain shapes
        const shapes = ['heart', 'heart', 'heart', 'star4', 'circle', 'petal'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    }

    update() {
        this.wobble += this.wobbleSpd;
        this.x += Math.sin(this.wobble) * 0.65 + this.speedX;
        this.y += this.speedY;
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
            const angle = (i * Math.PI) / 4 - Math.PI / 2;
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
        if (this.shape === 'heart') { this.drawHeart(0, 0, s); }
        else if (this.shape === 'star4') { this.drawStar4(0, 0, s * 1.1); }
        else if (this.shape === 'petal') { this.drawPetal(0, 0, s * 1.2); }
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

// ─── AUDIO PLAYER, PLAYLIST & LYRICS SYNC ─────────────────
const musicBtn = document.getElementById('musicCtrlBtn');
const musicIcon = document.getElementById('musicIcon');
const bgMusic = document.getElementById('bgMusic');
const subEn = document.getElementById('subEn');
const subPt = document.getElementById('subPt');
const liveSubtitles = document.getElementById('liveSubtitles');
const toggleLyricsBtn = document.getElementById('toggleLyricsBtn');
const lyricsContent = document.getElementById('lyricsContent');
const lyricsContainer = document.getElementById('lyricsContainerInner');

// Ensure the audio doesn't loop automatically so the ended event fires for the playlist
bgMusic.loop = false;

// Synced lyrics data for Song 1
const lyrics1 = [
    { time: 0.00, en: "🎵 (Instrumental Intro) 🎵", pt: "🎵 (Intro Instrumental) 🎵" },
    { time: 0.20, en: "I thought I saw your face today", pt: "Eu achei que tinha visto seu rosto hoje" },
    { time: 3.40, en: "But I just turned my head away", pt: "Mas só virei a cabeça para o outro lado" },
    { time: 6.80, en: "Your face against the trees", pt: "O seu rosto na sombra das árvores" },
    { time: 9.80, en: "But I just see the memories as they come, as they come", pt: "Mas vejo apenas as lembranças quando elas vêm, quando elas vêm" },
    { time: 18.70, en: "And I couldn't help but fall in love again", pt: "E eu não pude evitar me apaixonar de novo" },
    { time: 25.10, en: "No, I couldn't help but fall in love again", pt: "Não, eu não pude evitar me apaixonar de novo" },
    { time: 31.60, en: "I saw it glitter as I grew", pt: "Eu vi aquilo brilhar enquanto eu crescia" },
    { time: 35.10, en: "And loved it, boy, I never knew", pt: "E amei de verdade, garoto, eu nunca tinha percebido" },
    { time: 38.10, en: "I thought this place was heaven sent", pt: "Pensei que esse lugar fosse um presente dos céus" },
    { time: 40.90, en: "But now it's just a monument in my mind, in my mind", pt: "Mas agora é apenas um monumento na minha mente, na minha mente" },
    { time: 46.80, en: "And I couldn't help but fall in love again", pt: "E eu não pude evitar me apaixonar de novo" },
    { time: 56.00, en: "No, I couldn't help but fall in love again", pt: "Não, eu não pude evitar me apaixonar de novo" },
    { time: 63.20, en: "The cars and freeways implore me to stay away, out of this place", pt: "Os carros e as rodovias me imploram para ficar longe, bem longe desse lugar" },
    { time: 68.70, en: "My mother said, \"Just keep your head, and play it as it lays\"", pt: "Minha mãe disse: Só não perca o juízo e siga em frente do jeito que for" },
    { time: 76.00, en: "🎵 (Instrumental Solo) 🎵", pt: "🎵 (Solo Instrumental) 🎵" },
    { time: 108.10, en: "The cars and freeways implore me to stay away, out of this place", pt: "Os carros e as rodovias me imploram para ficar longe, bem longe desse lugar" },
    { time: 113.80, en: "My mother said, \"Just keep your head, and play it as it lays\"", pt: "Minha mãe disse: Só não perca o juízo e siga em frente do jeito que for" },
    { time: 119.50, en: "🎵 (Instrumental Break) 🎵", pt: "🎵 (Pausa Instrumental) 🎵" },
    { time: 123.10, en: "I somehow see what's beautiful", pt: "De alguma forma, vejo o que é belo" },
    { time: 126.20, en: "In things that are ephemeral", pt: "Nas coisas que são efêmeras" },
    { time: 128.80, en: "I'm my only friend of mine", pt: "Sou minha única amiga" },
    { time: 131.80, en: "Oh, love is just a piece of time", pt: "O amor é apenas um pedaço de tempo" },
    { time: 134.80, en: "In the world, in the world", pt: "No mundo, no mundo" },
    { time: 140.40, en: "And I couldn't help but fall in love again", pt: "E eu não pude evitar me apaixonar de novo" },
    { time: 145.80, en: "No, I couldn't help but fall in love again", pt: "Não, eu não pude evitar me apaixonar de novo" },
    { time: 152.30, en: "No, I couldn't help but fall in love again", pt: "Não, eu não pude evitar me apaixonar de novo" },
    { time: 158.00, en: "No, I couldn't help but fall in love again", pt: "Não, eu não pude evitar me apaixonar de novo" },
    { time: 164.10, en: "No, I couldn't help but fall in love again", pt: "Não, eu não pude evitar me apaixonar de novo" },
    { time: 172.00, en: "🎵 (Instrumental Outro) 🎵", pt: "🎵 (Fim Instrumental) 🎵" }
];

// Synced lyrics data for Song 2 (Hey There Delilah)
const lyrics2 = [
    { time: 0.00, en: "🎵 (Instrumental Intro) 🎵", pt: "🎵 (Intro Instrumental) 🎵" },
    { time: 9.80, en: "Hey there Delilah", pt: "Olá, Delilah" },
    { time: 11.10, en: "What's it like in New York City?", pt: "Como são as coisas aí em Nova Iorque?" },
    { time: 13.50, en: "I'm a thousand miles away", pt: "Eu estou a mil milhas de distância" },
    { time: 15.50, en: "But girl, tonight you look so pretty", pt: "Mas, menina, esta noite você está tão bonita" },
    { time: 18.30, en: "Yes you do", pt: "Sim, está sim" },
    { time: 21.50, en: "Times Square can't shine as bright as you", pt: "A Times Square não consegue brilhar tanto quanto você" },
    { time: 24.70, en: "I swear it's true", pt: "Juro que é verdade" },
    { time: 28.20, en: "Hey there Delilah", pt: "Olá, Delilah" },
    { time: 29.50, en: "Don't you worry about the distance", pt: "Não se preocupe com a distância" },
    { time: 31.90, en: "I'm right there if you get lonely", pt: "Eu estou logo ali, se você se sentir sozinha" },
    { time: 34.20, en: "Give this song another listen", pt: "Ouça esta canção novamente" },
    { time: 36.40, en: "Close your eyes", pt: "Feche seus olhos" },
    { time: 39.70, en: "Listen to my voice, it's my disguise", pt: "Escute minha voz, ela é o meu disfarce" },
    { time: 43.30, en: "I'm by your side", pt: "Eu estou ao seu lado" },
    { time: 46.50, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 51.00, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 55.50, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 60.20, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 63.60, en: "What you do to me", pt: "O que você faz comigo" },
    { time: 67.50, en: "Hey there Delilah", pt: "Olá, Delilah" },
    { time: 68.70, en: "I know times are getting hard", pt: "Eu sei que os tempos estão ficando difíceis" },
    { time: 71.10, en: "But just believe me, girl", pt: "Mas apenas acredite em mim, menina" },
    { time: 72.80, en: "Someday I'll pay the bills with this guitar", pt: "Um dia eu pagarei as contas com este violão" },
    { time: 75.70, en: "We'll have it good", pt: "Nós vamos ficar bem" },
    { time: 78.90, en: "We'll have the life we knew we would", pt: "Nós vamos ter a vida que sabíamos que teríamos" },
    { time: 82.40, en: "My word is good", pt: "Minha palavra é boa" },
    { time: 85.80, en: "Hey there Delilah", pt: "Olá, Delilah" },
    { time: 87.10, en: "I've got so much left to say to you", pt: "Eu ainda tenho tanto pra dizer" },
    { time: 89.40, en: "If every simple song I wrote to you", pt: "Se cada canção que escrevi para você" },
    { time: 92.20, en: "Would take your breath away", pt: "Pudesse tirar seu fôlego" },
    { time: 94.00, en: "I'd write it all", pt: "Eu escreveria todas" },
    { time: 97.30, en: "Even more in love with me you'd fall", pt: "Ainda mais apaixonada por mim você ficaria" },
    { time: 100.90, en: "We'd have it all", pt: "Nós teríamos tudo" },
    { time: 103.80, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 108.70, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 113.30, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 117.80, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 122.50, en: "A thousand miles seems pretty far", pt: "Mil milhas parecem bastante coisa" },
    { time: 124.60, en: "But they've got planes and trains and cars", pt: "Mas eles têm aviões e trens e carros" },
    { time: 126.90, en: "I'd walk to you if I had no other way", pt: "Eu andaria até você se não houvesse outra maneira" },
    { time: 131.50, en: "Our friends would all make fun of us", pt: "Todos nossos amigos iriam rir de nós" },
    { time: 133.80, en: "And we'll just laugh along because we know", pt: "Mas nós vamos rir junto, porque sabemos" },
    { time: 136.70, en: "That none of them have felt this way", pt: "Que nenhum deles já se sentiu assim" },
    { time: 140.80, en: "Delilah I can promise you", pt: "Delilah, eu posso te prometer" },
    { time: 142.90, en: "That by the time we get through", pt: "Que quando superarmos isso" },
    { time: 145.30, en: "The world will never ever be the same", pt: "O mundo nunca mais será o mesmo" },
    { time: 149.70, en: "And you're to blame", pt: "E você é a responsável" },
    { time: 154.90, en: "Hey there Delilah", pt: "Olá, Delilah" },
    { time: 156.30, en: "You be good and don't you miss me", pt: "Seja boa e não sinta minha falta" },
    { time: 158.80, en: "Two more years and you'll be done with school", pt: "Mais dois anos e você terá terminado a escola" },
    { time: 161.40, en: "And I'll be making history like I do", pt: "E eu estarei fazendo história como faço" },
    { time: 166.70, en: "You'll know it's all because of you", pt: "Você sabe que tudo isto é por sua causa" },
    { time: 171.20, en: "We can do whatever we want to", pt: "Nós podemos fazer o que quisermos" },
    { time: 176.00, en: "Hey there Delilah here's to you", pt: "Ei, Delilah, um brinde a você" },
    { time: 179.50, en: "This one's for you", pt: "Esta é pra você" },
    { time: 184.90, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 189.40, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 194.00, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 198.50, en: "Oh it's what you do to me", pt: "Oh, é o que você faz comigo" },
    { time: 202.10, en: "What you do to me", pt: "O que você faz comigo" },
    { time: 205.00, en: "Ho-oh, woah-oh, woah oh-oh oh-oh", pt: "Ho-oh, uou-oh, uou oh-oh oh-oh" },
    { time: 210.00, en: "Oh-oh, woah oh-oh oh woah", pt: "Oh-oh, uou oh-oh oh uou" },
    { time: 215.00, en: "Oh oh-woah oh-oh, ooh-ooh, ooh-ooh", pt: "Oh oh-uou oh-oh, ooh-ooh, ooh-ooh" }
];

// Playlist
const playlist = [
    { src: 'music.mp3', lyrics: lyrics1 },
    { src: 'music2.mp3', lyrics: lyrics2 }
];

let currentSongIndex = 0;
let currentActiveIndex = -1;

// Function to render lyrics for the current song
function renderLyrics() {
    lyricsContainer.innerHTML = '';
    currentActiveIndex = -1;
    const currentLyrics = playlist[currentSongIndex].lyrics;
    
    currentLyrics.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'lyric-row';
        row.setAttribute('data-index', index);
        row.innerHTML = `
            <p class="lyric-en">${item.en}</p>
            <p class="lyric-pt">${item.pt}</p>
        `;
        
        row.addEventListener('click', () => {
            bgMusic.currentTime = item.time;
            if (bgMusic.paused) playMusic();
        });
        
        lyricsContainer.appendChild(row);
    });
}

// Initialize first song lyrics
renderLyrics();

// Helper functions for playing/pausing music
function playMusic() {
    bgMusic.play()
        .then(() => {
            musicBtn.classList.add('playing');
            musicIcon.textContent = '⏸';
            liveSubtitles.classList.remove('hidden');
        })
        .catch(err => {
            console.log("Autoplay bloqueado ou arquivo não encontrado: ", err);
        });
}

function pauseMusic() {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
    musicIcon.textContent = '🎵';
}

// Click music control button
musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering global play
    if (bgMusic.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
});

// Switch to next song on end
bgMusic.addEventListener('ended', () => {
    currentSongIndex++;
    if (currentSongIndex < playlist.length) {
        bgMusic.src = playlist[currentSongIndex].src;
        renderLyrics();
        // Allow a small delay before playing next
        setTimeout(playMusic, 500);
    } else {
        // Playlist finished! Loop back to start
        currentSongIndex = 0;
        bgMusic.src = playlist[currentSongIndex].src;
        renderLyrics();
        pauseMusic();
    }
});

// Synced lyrics updates
bgMusic.addEventListener('timeupdate', () => {
    const currentTime = bgMusic.currentTime;
    const currentLyrics = playlist[currentSongIndex].lyrics;
    
    let activeIndex = -1;
    for (let i = 0; i < currentLyrics.length; i++) {
        if (currentTime >= currentLyrics[i].time) {
            activeIndex = i;
        } else {
            break;
        }
    }
    
    if (activeIndex !== currentActiveIndex) {
        // Remove active class from old row
        if (currentActiveIndex !== -1) {
            const oldRow = document.querySelector(`.lyric-row[data-index="${currentActiveIndex}"]`);
            if (oldRow) oldRow.classList.remove('active');
        }
        
        // Add active class to new row
        if (activeIndex !== -1) {
            const newRow = document.querySelector(`.lyric-row[data-index="${activeIndex}"]`);
            if (newRow) {
                newRow.classList.add('active');
                
                // Auto scroll inside the lyrics container
                if (lyricsContent.classList.contains('show')) {
                    const containerHeight = lyricsContent.clientHeight;
                    const rowOffsetTop = newRow.offsetTop;
                    const rowHeight = newRow.clientHeight;
                    lyricsContent.scrollTo({
                        top: rowOffsetTop - (containerHeight / 2) + (rowHeight / 2),
                        behavior: 'smooth'
                    });
                }
            }
            
            // Crossfade subtitles in the live container
            subEn.style.opacity = 0;
            subPt.style.opacity = 0;
            setTimeout(() => {
                if(currentLyrics[activeIndex]) {
                    subEn.textContent = currentLyrics[activeIndex].en;
                    subPt.textContent = currentLyrics[activeIndex].pt;
                    subEn.style.opacity = 1;
                    subPt.style.opacity = 1;
                }
            }, 150);
        }
        
        currentActiveIndex = activeIndex;
    }
});

// Lyrics toggle action
toggleLyricsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggleLyricsBtn.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
        lyricsContent.classList.remove('show');
        toggleLyricsBtn.setAttribute('aria-expanded', 'false');
        toggleLyricsBtn.textContent = 'Ver Letra da Música 🎵';
    } else {
        lyricsContent.classList.add('show');
        toggleLyricsBtn.setAttribute('aria-expanded', 'true');
        toggleLyricsBtn.textContent = 'Fechar Letra ❌';
        
        // Auto scroll to active lyric if one is selected
        setTimeout(() => {
            if (currentActiveIndex !== -1) {
                const activeRow = document.querySelector(`.lyric-row[data-index="${currentActiveIndex}"]`);
                if (activeRow) {
                    const containerHeight = lyricsContent.clientHeight;
                    const rowOffsetTop = activeRow.offsetTop;
                    const rowHeight = activeRow.clientHeight;
                    lyricsContent.scrollTo({
                        top: rowOffsetTop - (containerHeight / 2) + (rowHeight / 2),
                        behavior: 'smooth'
                    });
                }
            } else {
                lyricsContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 200);
    }
});

// Attempt Autoplay on Load
let userHasInteracted = false;
bgMusic.volume = 0.6; // Slightly softer volume for comfort
const autoPlayPromise = bgMusic.play();

if (autoPlayPromise !== undefined) {
    autoPlayPromise.then(() => {
        musicBtn.classList.add('playing');
        musicIcon.textContent = '⏸';
        liveSubtitles.classList.remove('hidden');
        userHasInteracted = true;
    }).catch(error => {
        // Autoplay blocked. Wait for user interaction anywhere
        const startAudioOnInteraction = () => {
            if (!userHasInteracted && bgMusic.paused) {
                playMusic();
                userHasInteracted = true;
            }
            document.body.removeEventListener('click', startAudioOnInteraction);
            document.body.removeEventListener('touchstart', startAudioOnInteraction);
        };
        
        document.body.addEventListener('click', startAudioOnInteraction);
        document.body.addEventListener('touchstart', startAudioOnInteraction);
    });
}
