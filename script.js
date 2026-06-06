document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initCanvasBackground();
    initScrollReveal();
    initSteamCopy();
});

/* ===== 加载动画 ===== */
function initLoader() {
    const loader = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');
    const mainContent = document.getElementById('mainContent');

    let currentProgress = 0;
    const targetProgress = 100;
    const duration = 1800;
    const startTime = performance.now();

    function updateLoader(now) {
        const elapsed = now - startTime;
        const easeOut = 1 - Math.pow(1 - Math.min(elapsed / duration, 1), 3);
        currentProgress = easeOut * targetProgress;

        progress.style.width = currentProgress + '%';

        if (elapsed < duration) {
            requestAnimationFrame(updateLoader);
        } else {
            progress.style.width = '100%';
            setTimeout(() => {
                loader.classList.add('hidden');
                mainContent.classList.add('visible');
            }, 400);
        }
    }

    requestAnimationFrame(updateLoader);
}

/* ===== Canvas 粒子背景 ===== */
function initCanvasBackground() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const particleCount = 60;
    const connectionDistance = 120;
    const maxConnections = 3;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        // 绘制粒子
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
            ctx.fill();
        });

        // 绘制连线
        for (let i = 0; i < particles.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance && connections < maxConnections) {
                    const opacity = (1 - dist / connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(167, 139, 250, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    connections++;
                }
            }
        }
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        });
    }

    let frameCount = 0;
    function animate() {
        frameCount++;
        // 每2帧更新一次，降低CPU占用
        if (frameCount % 2 === 0) {
            updateParticles();
            drawParticles();
        }
        requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
}

/* ===== 滚动显示动画 ===== */
function initScrollReveal() {
    const sections = document.querySelectorAll('.about-section, .links-section, .footer');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    sections.forEach((section, index) => {
        section.classList.add('scroll-reveal');
        section.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(section);
    });
}

/* ===== Steam 复制功能 ===== */
function initSteamCopy() {
    const steamCard = document.getElementById('steamCard');
    const steamCode = document.getElementById('steamCode');
    const copyToast = document.getElementById('copyToast');

    if (!steamCard || !steamCode || !copyToast) return;

    steamCard.addEventListener('click', () => {
        const code = steamCode.textContent;

        navigator.clipboard.writeText(code).then(() => {
            showToast(copyToast);
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast(copyToast);
        });
    });
}

function showToast(toast) {
    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 2200);
}
