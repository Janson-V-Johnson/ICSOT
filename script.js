// ===== CONFERENCE DATA =====
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1AIGQPyms-ZimnswyB4e_3VwF72ZQ-C1n2UQBrxb8nfA/export?format=csv';

const scheduleData = {
    "Dec 12": {
        "Kalidas Auditorium": [
            { time: "09:15-09:20", title: "LIGHTING THE LAMP", type: "keynote" },
        ],
        "Gargi Auditorium": [
            { time: "11:20-11:50", title: "INVITED TALK: Dr Subhendu Maity", type: "invited" },
            { time: "17:45-18:00", title: "Numerical simulation of ship motions in regular waves in damaged condition", id: "46" }
        ],
        "Maitree Auditorium": [
            { time: "12:20-12:35", title: "Behaviour of a re-entrant auxetic core sandwich plate structure subject to an underwater explosion", id: "7" },
        ]
    },
    "Dec 13": {
        "Kalidas Auditorium": [
            { time: "09:00-09:30", title: "KEYNOTE ADDRESS: Prof. Richard Manasseh", type: "keynote" },
            { time: "17:00", title: "HIGH TEA", type: "break" }
        ],
        "Maitree Auditorium": [
            { time: "10:15-10:45", title: "INVITED TALK: Dr Harekrushna Behera", type: "invited" },
        ],
        "Gargi Auditorium": [
            { time: "11:15-11:30", title: "Vibroacoustic transmission analysis of complex structure within underwater layered media", id: "38" },
            { time: "11:30-11:45", title: "Development of General Guideline for Riverine floating HDPE Jetties Encapsulated by Steel Frame", id: "59" },
        ]
    }
};

let csvData = [];

// ===== CSV LOADING =====
async function loadCSV() {
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const rows = text.split('\n').map(row => row.split(','));
        csvData = rows.slice(1).map(row => ({
            id: row[0]?.trim(),
            name: row[1]?.trim(),
            location: row[2]?.trim(),
            time: row[3]?.trim(),
            date: row[4]?.trim()
        }));
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

// ===== SCHEDULE RENDERING =====
function renderSchedule() {
    const container = document.getElementById('scheduleContainer');
    let html = '';

    for (const [day, venues] of Object.entries(scheduleData)) {
        html += `<div class="day-schedule fade-in">
            <div class="day-title">📆 ${day}th December, 2025</div>`;

        for (const [venue, sessions] of Object.entries(venues)) {
            html += `<div class="venue-group">
                <div class="venue-title">📍 ${venue}</div>`;

            sessions.forEach(session => {
                const cardClass = session.type === 'keynote' ? 'session-card keynote' :
                    session.type === 'invited' ? 'session-card invited' :
                        session.type === 'break' ? 'session-card' : 'session-card';
                html += `<div class="${cardClass}">
                    <div class="session-time">⏰ ${session.time}</div>
                    <div class="session-title">${session.title}</div>
                    ${session.id ? `<div class="session-id">Abstract ID: ${session.id}</div>` : ''}
                </div>`;
            });

            html += `</div>`;
        }

        html += `</div>`;
    }

    container.innerHTML = html;
}

// ===== SEARCH FUNCTIONALITY =====
async function searchAbstract() {
    const searchInput = document.getElementById('searchInput').value.trim();
    const resultCard = document.getElementById('resultCard');
    const errorMessage = document.getElementById('errorMessage');
    const auditoriumResult = document.getElementById('auditoriumResult');

    resultCard.style.display = 'none';
    errorMessage.style.display = 'none';
    auditoriumResult.style.display = 'none';

    if (!searchInput) {
        errorMessage.textContent = 'Please enter an Abstract ID';
        errorMessage.style.display = 'block';
        return;
    }

    const result = csvData.find(item => item.id === searchInput);

    if (result) {
        resultCard.innerHTML = `
            <h3>📋 Abstract Details</h3>
            <div class="result-detail">
                <div class="result-label">Abstract ID:</div>
                <div class="result-value">${result.id}</div>
            </div>
            <div class="result-detail">
                <div class="result-label">Title:</div>
                <div class="result-value">${result.name}</div>
            </div>
            <div class="result-detail">
                <div class="result-label">Location:</div>
                <div class="result-value">${result.location}</div>
            </div>
            <div class="result-detail">
                <div class="result-label">Time:</div>
                <div class="result-value">${result.time}</div>
            </div>
            <div class="result-detail">
                <div class="result-label">Date:</div>
                <div class="result-value">${result.date}</div>
            </div>
        `;
        resultCard.style.display = 'block';
    } else {
        errorMessage.textContent = `No abstract found with ID: ${searchInput}`;
        errorMessage.style.display = 'block';
    }
}

// ===== AUDITORIUM FILTER =====
function showAuditoriumPrograms(auditoriumName) {
    const auditoriumResult = document.getElementById('auditoriumResult');
    const errorMessage = document.getElementById('errorMessage');
    const resultCard = document.getElementById('resultCard');

    // Hide other result displays
    resultCard.style.display = 'none';
    errorMessage.style.display = 'none';

    let programs = [];

    // Collect all programs for this auditorium from all days
    for (const [day, venues] of Object.entries(scheduleData)) {
        if (venues[auditoriumName]) {
            venues[auditoriumName].forEach(session => {
                programs.push({
                    day: day,
                    time: session.time,
                    title: session.title,
                    id: session.id || null,
                    type: session.type || null
                });
            });
        }
    }

    if (programs.length === 0) {
        errorMessage.textContent = `No programs found for ${auditoriumName}`;
        errorMessage.style.display = 'block';
        auditoriumResult.style.display = 'none';
        return;
    }

    // Build the result HTML
    let html = `<h3>🎭 Programs at ${auditoriumName}</h3>`;

    programs.forEach(program => {
        const dateText = program.day === "Dec 12" ? "December 12, 2025" : "December 13, 2025";
        html += `
            <div style="background: rgba(255,255,255,0.08); padding: 1.2rem; border-radius: 12px; margin-bottom: 1rem; border-left: 3px solid var(--color-accent-cyan);">
                <div class="result-detail">
                    <div class="result-label">Date:</div>
                    <div class="result-value">${dateText}</div>
                </div>
                <div class="result-detail">
                    <div class="result-label">Time:</div>
                    <div class="result-value">${program.time}</div>
                </div>
                <div class="result-detail">
                    <div class="result-label">Title:</div>
                    <div class="result-value">${program.title}</div>
                </div>
                ${program.id ? `
                <div class="result-detail">
                    <div class="result-label">Abstract ID:</div>
                    <div class="result-value">${program.id}</div>
                </div>
                ` : ''}
            </div>
        `;
    });

    auditoriumResult.innerHTML = html;
    auditoriumResult.style.display = 'block';
}

// ===== PARTICLE ANIMATION =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 150;
        this.connectionDistance = 150;
        this.mouse = { x: null, y: null, radius: 150 };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
            this.ctx.fill();
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= Math.cos(angle) * force * 0.2;
                    particle.vy -= Math.sin(angle) * force * 0.2;
                }
            }

            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw gradient background
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#050505');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateParticles();
        this.drawConnections();
        this.drawParticles();

        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// ===== SCROLL REVEAL ANIMATION =====
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in');
        this.init();
    }

    init() {
        this.observeElements();
    }

    observeElements() {
        const options = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===== NAVIGATION SCROLL EFFECT =====
class NavigationScroll {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.nav.style.background = 'rgba(5, 5, 5, 0.95)';
                this.nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            } else {
                this.nav.style.background = 'rgba(5, 5, 5, 0.7)';
                this.nav.style.boxShadow = 'none';
            }
        });
    }
}

// ===== ENTER KEY SUPPORT =====
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchAbstract();
            }
        });
    }
});

// ===== INITIALIZE ALL =====
window.onload = async function () {
    // Load conference data
    await loadCSV();
    renderSchedule();

    // Initialize visual effects
    new ParticleSystem();
    new ScrollReveal();
    new SmoothScroll();
    new NavigationScroll();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
};
