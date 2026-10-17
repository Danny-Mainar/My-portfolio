/* ==========================================
   Portfolio Interactivity, Smooth Scroll & PCB Animation
   ================================---------- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scroll Momentum Engine (Lerp Loop)
    const smoothContent = document.getElementById('smooth-content');
    
    let currentY = 0;
    let targetY = 0;
    const ease = 0.07; // Adjust for momentum weight (lower = smoother/slower, higher = faster)

    function updateBodyHeight() {
        if (smoothContent) {
            document.body.style.height = `${smoothContent.getBoundingClientRect().height}px`;
        }
    }

    window.addEventListener('resize', updateBodyHeight);
    updateBodyHeight();

    window.addEventListener('scroll', () => {
        targetY = window.scrollY;
    });

    function momentumTicker() {
        currentY += (targetY - currentY) * ease;
        if (smoothContent) {
            smoothContent.style.transform = `translate3d(0, -${currentY}px, 0)`;
        }
        requestAnimationFrame(momentumTicker);
    }
    momentumTicker();

    // 2. Mobile Navigation Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .btn-nav');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // 3. Viewport Detection (Intersection Observer API)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });

    // 4. Animated PCB Circuit Background with Electron Tracing
    const canvas = document.getElementById('pcb-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let traces = [];
    let electrons = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initPCB();
    }

    function initPCB() {
        traces = [];
        electrons = [];
        const numTraces = Math.floor((width * height) / 35000);

        for (let i = 0; i < numTraces; i++) {
            let points = [];
            let x = Math.random() * width;
            let y = Math.random() * height;
            let segments = Math.floor(Math.random() * 4) + 3;

            points.push({ x, y });

            for (let j = 0; j < segments; j++) {
                if (j % 2 === 0) {
                    x += (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 250 + 100);
                } else {
                    y += (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 250 + 100);
                }
                x = Math.max(20, Math.min(width - 20, x));
                y = Math.max(20, Math.min(height - 20, y));
                points.push({ x, y });
            }

            traces.push(points);

            electrons.push({
                traceIndex: traces.length - 1,
                segmentIndex: 0,
                progress: Math.random(),
                speed: Math.random() * 0.004 + 0.0015,
                color: Math.random() > 0.3 ? '#00ffcc' : '#3b82f6'
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(0, 255, 204, 0.12)';
        ctx.fillStyle = 'rgba(0, 255, 204, 0.25)';

        traces.forEach(points => {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();

            points.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
            });
        });

        electrons.forEach(e => {
            const points = traces[e.traceIndex];
            if (!points || points.length < 2) return;

            const p1 = points[e.segmentIndex];
            const p2 = points[e.segmentIndex + 1];

            e.progress += e.speed;
            if (e.progress >= 1) {
                e.progress = 0;
                e.segmentIndex++;
                if (e.segmentIndex >= points.length - 1) {
                    e.segmentIndex = 0;
                }
            }

            const currentX = p1.x + (p2.x - p1.x) * e.progress;
            const currentY = p1.y + (p2.y - p1.y) * e.progress;

            ctx.shadowBlur = 12;
            ctx.shadowColor = e.color;
            ctx.fillStyle = e.color;
            ctx.beginPath();
            ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
});