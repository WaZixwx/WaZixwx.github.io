document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initCanvasBackground();
    initScrollReveal();
    initSteamCopy();
    initLangSwitcher();
    initGlitchText();
    initQRParallax();
});

/* ===== 多语言数据 ===== */
const i18n = {
    zh: {
        nickname: '袜子',
        aboutTitle: '关于我',
        aboutText1: '我喜欢听音乐！尤其是<span class="highlight">黑暗小英文歌</span>和<span class="highlight">emo中文歌</span>，是纯郁风（）。',
        aboutText2: '还喜欢写点小说啥的。喜欢玩游戏，喜欢交朋友～',
        aboutWelcome: '欢迎来找我玩呀',
        linksTitle: '找到我',
        qqDesc: '扫描二维码添加',
        qrLabel: '扫码添加好友',
        steamDesc: '点击复制好友代码',
        gameTitle: '游戏ID',
        gameDesc: '全平台同名',
        gameId: '超帅袜狗',
        gameNote: '也许有例外 ;)',
        footer: 'Made with 💜 by 袜子',
        toastText: '已复制到剪贴板'
    },
    en: {
        nickname: 'Socks',
        aboutTitle: 'About Me',
        aboutText1: 'I love listening to music! Especially <span class="highlight">dark indie English songs</span> and <span class="highlight">emo Chinese songs</span>. Pure melancholy vibe ().',
        aboutText2: 'I also like writing novels. Love gaming and making friends~',
        aboutWelcome: 'Come hang out with me!',
        linksTitle: 'Find Me',
        qqDesc: 'Scan QR code to add',
        qrLabel: 'Scan to add friend',
        steamDesc: 'Click to copy friend code',
        gameTitle: 'Game ID',
        gameDesc: 'Same name on all platforms',
        gameId: 'SuperCoolSockDog',
        gameNote: 'Maybe with exceptions ;)',
        footer: 'Made with 💜 by Socks',
        toastText: 'Copied to clipboard'
    },
    ja: {
        nickname: '靴下',
        aboutTitle: '自己紹介',
        aboutText1: '音楽を聴くのが好き！特に<span class="highlight">ダークなインディー英語曲</span>と<span class="highlight">エモい中国語曲</span>が好き。純粋な憂鬱系（）。',
        aboutText2: '小説を書いたりもする。ゲームが好きで、友達を作るのも好き～',
        aboutWelcome: '遊びに来てね！',
        linksTitle: '連絡先',
        qqDesc: 'QRコードをスキャン',
        qrLabel: 'スキャンして友達追加',
        steamDesc: 'クリックしてフレンドコードをコピー',
        gameTitle: 'ゲームID',
        gameDesc: '全プラットフォーム同じ名前',
        gameId: '超かっこいい靴下犬',
        gameNote: '例外があるかも ;)',
        footer: 'Made with 💜 by 靴下',
        toastText: 'クリップボードにコピーしました'
    },
    ko: {
        nickname: '양말',
        aboutTitle: '소개',
        aboutText1: '음악 듣는 걸 좋아해! 특히 <span class="highlight">다크한 인디 영어곡</span>이랑 <span class="highlight">emo 중국어 노래</span>를 좋아해. 순수한 우울풍 ().',
        aboutText2: '소설도 좀 써. 게임하는 거랑 친구 사귀는 거 좋아해～',
        aboutWelcome: '놀러 와!',
        linksTitle: '연락처',
        qqDesc: 'QR 코드 스캔해서 추가',
        qrLabel: '스캔해서 친구 추가',
        steamDesc: '클릭해서 친구 코드 복사',
        gameTitle: '게임 ID',
        gameDesc: '모든 플랫폼에서 같은 이름',
        gameId: '멋진양말개',
        gameNote: '예외가 있을지도 ;)',
        footer: 'Made with 💜 by 양말',
        toastText: '클립보드에 복사됨'
    }
};

/* ===== 语言切换 ===== */
function initLangSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    const buttons = switcher.querySelectorAll('.lang-btn');

    // 检测浏览器首选语言
    function detectBrowserLang() {
        const navLang = navigator.language || navigator.userLanguage || 'zh';
        const langMap = {
            'zh': 'zh', 'zh-CN': 'zh', 'zh-TW': 'zh', 'zh-HK': 'zh',
            'en': 'en', 'en-US': 'en', 'en-GB': 'en',
            'ja': 'ja', 'jp': 'ja',
            'ko': 'ko', 'kr': 'ko'
        };
        const primary = navLang.split('-')[0];
        return langMap[navLang] || langMap[primary] || 'zh';
    }

    let currentLang = detectBrowserLang();

    // 初始化：应用检测到的语言并高亮对应按钮
    applyLanguage(currentLang);
    buttons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang === currentLang) return;

            currentLang = lang;

            // 更新按钮状态
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 更新文本内容
            applyLanguage(lang);
        });
    });
}

function applyLanguage(lang) {
    const texts = i18n[lang];
    if (!texts) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (texts[key] !== undefined) {
            el.innerHTML = texts[key];
        }
    });

    // 更新 html lang 属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' :
                                     lang === 'en' ? 'en' :
                                     lang === 'ja' ? 'ja' : 'ko';
}

/* ===== Glitch 文字随机故障效果 ===== */
function initGlitchText() {
    const glitchEl = document.querySelector('.name-glitch');
    if (!glitchEl) return;

    const originalText = glitchEl.dataset.text;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    function randomGlitch() {
        // 随机决定是否触发故障
        if (Math.random() > 0.3) {
            const glitchLength = Math.floor(Math.random() * 3) + 1;
            const startPos = Math.floor(Math.random() * (originalText.length - glitchLength + 1));
            let glitched = originalText.split('');

            for (let i = 0; i < glitchLength; i++) {
                glitched[startPos + i] = chars[Math.floor(Math.random() * chars.length)];
            }

            glitchEl.textContent = glitched.join('');

            // 快速恢复
            setTimeout(() => {
                glitchEl.textContent = originalText;
            }, 80 + Math.random() * 120);
        }

        // 下一次故障
        setTimeout(randomGlitch, 800 + Math.random() * 2500);
    }

    // 延迟开始
    setTimeout(randomGlitch, 2000);
}

/* ===== QQ 卡片视差效果 ===== */
function initQRParallax() {
    const qqCard = document.getElementById('qqCard');
    const qrBox = document.getElementById('qrBox');

    if (!qqCard || !qrBox) return;

    qqCard.addEventListener('mousemove', (e) => {
        const rect = qqCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;

        qrBox.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`;
    });

    qqCard.addEventListener('mouseleave', () => {
        qrBox.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(0.9)';
    });
}

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

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
            ctx.fill();
        });

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
