/**
 * 主要脚本文件
 * 
 * 处理网站的核心功能，包括导航、动画、彩蛋和主题切换
 */
(function() {
    // 全局变量，用于鼠标指针效果
    let cursorDot, cursorOutline;
    
    // DOM加载完成后执行
    document.addEventListener('DOMContentLoaded', () => {
        // 初始化鼠标指针元素
        cursorDot = document.querySelector('.cursor-dot');
        cursorOutline = document.querySelector('.cursor-outline');
        
        // 初始化各种功能
        initLoader();
        initNavigation();
        initEasterEgg();
        initThemeToggle();
        initBackToTop();
        initFormEvents();
        initSectionAnimation();
        initBiliBiliIcon();
        setCurrentYear();
        
        // 确保DOM已加载完成后再设置交互元素
        if (cursorDot && cursorOutline) {
            setupInteractiveElements();
        }
    });
    
    /**
     * 初始化页面加载动画
     */
    function initLoader() {
        const loaderWrapper = document.querySelector('.loader-wrapper');
        
        // 检查是否有加载器
        if (!loaderWrapper) return;
        
        // 模拟加载进度
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                clearInterval(interval);
                
                // 页面加载完成，隐藏加载器
                setTimeout(() => {
                    loaderWrapper.classList.add('fade-out');
                    
                    // 移除加载器并开始开场动画
                    setTimeout(() => {
                        loaderWrapper.remove();
                        
                        // 确保英雄部分默认不可见
                        const heroSection = document.querySelector('.hero-section');
                        if (heroSection) {
                            heroSection.style.opacity = '0';
                        }
                        
                        // 触发开场动画
                        if (typeof window.startIntroAnimation === 'function') {
                            window.startIntroAnimation();
                        }
                    }, 600);
                }, 500);
            }
        }, 200);
    }
    
    /**
     * 初始化导航功能
     */
    function initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // 移动端菜单切换
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });
        }
        
        // 导航链接点击
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // 关闭移动端菜单
                if (navToggle && navToggle.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
                
                // 平滑滚动到目标位置
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#') && targetId !== '#') {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // 添加动画类
                        targetElement.classList.add('highlight');
                        
                        // 平滑滚动
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // 更新URL，但不滚动
                        history.pushState(null, null, targetId);
                        
                        // 移除高亮动画
                        setTimeout(() => {
                            targetElement.classList.remove('highlight');
                        }, 1500);
                    }
                }
            });
        });
        
        // 高亮当前活动导航项
        window.addEventListener('scroll', highlightNavigation);
        
        function highlightNavigation() {
            const sections = document.querySelectorAll('section');
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        // 初始执行一次
        highlightNavigation();
    }
    
    /**
     * 初始化彩蛋功能
     */
    function initEasterEgg() {
        const easterEggTrigger = document.querySelector('.easter-egg-trigger');
        const easterEggModal = document.querySelector('.easter-egg-modal');
        const closeModal = document.querySelector('.close-modal');
        const gameCanvas = document.getElementById('game-canvas');
        const gameStart = document.getElementById('game-start');
        const scoreElement = document.getElementById('score');
        
        // 检查是否有彩蛋
        if (!easterEggTrigger || !easterEggModal) return;
        
        // 打开彩蛋
        easterEggTrigger.addEventListener('click', () => {
            easterEggModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        
        // 关闭彩蛋
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                easterEggModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        }
        
        // 点击模态框外部关闭
        easterEggModal.addEventListener('click', (e) => {
            if (e.target === easterEggModal) {
                easterEggModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
        
        // 简单小游戏
        if (gameCanvas && gameStart && scoreElement) {
            const ctx = gameCanvas.getContext('2d');
            let gameInterval;
            let score = 0;
            let player = { x: 20, y: 150, width: 20, height: 20 };
            let obstacles = [];
            let isGameRunning = false;
            
            // 设置画布尺寸
            function resizeCanvas() {
                gameCanvas.width = gameCanvas.clientWidth;
                gameCanvas.height = gameCanvas.clientHeight;
            }
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            // 开始游戏
            gameStart.addEventListener('click', () => {
                if (!isGameRunning) {
                    resetGame();
                    isGameRunning = true;
                    gameInterval = setInterval(updateGame, 20);
                    gameStart.textContent = '重新开始';
                } else {
                    resetGame();
                }
            });
            
            // 重置游戏
            function resetGame() {
                clearInterval(gameInterval);
                player = { x: 20, y: gameCanvas.height / 2, width: 20, height: 20 };
                obstacles = [];
                score = 0;
                scoreElement.textContent = score;
                isGameRunning = true;
                gameInterval = setInterval(updateGame, 20);
            }
            
            // 键盘控制
            window.addEventListener('keydown', (e) => {
                if (!isGameRunning) return;
                
                if (e.key === 'ArrowUp') {
                    player.y -= 10;
                } else if (e.key === 'ArrowDown') {
                    player.y += 10;
                }
                
                // 边界检查
                if (player.y < 0) player.y = 0;
                if (player.y + player.height > gameCanvas.height) player.y = gameCanvas.height - player.height;
            });
            
            // 鼠标/触摸控制
            gameCanvas.addEventListener('mousemove', (e) => {
                if (!isGameRunning) return;
                
                const canvasRect = gameCanvas.getBoundingClientRect();
                player.y = e.clientY - canvasRect.top - player.height / 2;
                
                // 边界检查
                if (player.y < 0) player.y = 0;
                if (player.y + player.height > gameCanvas.height) player.y = gameCanvas.height - player.height;
            });
            
            // 更新游戏状态
            function updateGame() {
                // 清空画布
                ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                
                // 生成障碍物
                if (Math.random() < 0.02) {
                    const height = Math.random() * (gameCanvas.height / 2);
                    obstacles.push({
                        x: gameCanvas.width,
                        y: 0,
                        width: 15,
                        height: height,
                        color: `hsl(${Math.random() * 360}, 80%, 60%)`
                    });
                    
                    obstacles.push({
                        x: gameCanvas.width,
                        y: height + 80, // 中间间隙
                        width: 15,
                        height: gameCanvas.height - height - 80,
                        color: `hsl(${Math.random() * 360}, 80%, 60%)`
                    });
                }
                
                // 更新障碍物位置
                for (let i = 0; i < obstacles.length; i++) {
                    obstacles[i].x -= 5;
                    
                    // 绘制障碍物
                    ctx.fillStyle = obstacles[i].color;
                    ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
                    
                    // 碰撞检测
                    if (
                        player.x < obstacles[i].x + obstacles[i].width &&
                        player.x + player.width > obstacles[i].x &&
                        player.y < obstacles[i].y + obstacles[i].height &&
                        player.y + player.height > obstacles[i].y
                    ) {
                        // 碰撞，游戏结束
                        clearInterval(gameInterval);
                        isGameRunning = false;
                        
                        // 显示游戏结束
                        ctx.fillStyle = '#FF5E5B';
                        ctx.font = '20px Arial';
                        ctx.fillText('游戏结束!', gameCanvas.width / 2 - 50, gameCanvas.height / 2);
                        return;
                    }
                    
                    // 通过障碍物
                    if (obstacles[i].x + obstacles[i].width < player.x && !obstacles[i].passed) {
                        obstacles[i].passed = true;
                        score++;
                        scoreElement.textContent = score;
                    }
                }
                
                // 移除离开画布的障碍物
                obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
                
                // 绘制玩家
                ctx.fillStyle = '#4361EE';
                ctx.fillRect(player.x, player.y, player.width, player.height);
                
                // 绘制得分
                ctx.fillStyle = '#1E293B';
                ctx.font = '16px Arial';
                ctx.fillText(`分数: ${score}`, 10, 20);
            }
            
            // 初始绘制
            ctx.fillStyle = '#4361EE';
            ctx.font = '20px Arial';
            ctx.fillText('点击开始游戏', gameCanvas.width / 2 - 70, gameCanvas.height / 2);
        }
    }
    
    /**
     * 初始化主题切换
     */
    function initThemeToggle() {
        const themeButton = document.querySelector('.theme-button');
        const themeIcon = themeButton ? themeButton.querySelector('i') : null;
        
        // 检查是否有主题切换按钮
        if (!themeButton || !themeIcon) return;
        
        // 检查用户偏好
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        // 初始主题设置
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        // 主题切换
        themeButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // 更新图标
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    /**
     * 初始化回到顶部按钮
     */
    function initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        
        // 检查是否有回到顶部按钮
        if (!backToTop) return;
        
        // 点击回到顶部
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    /**
     * 初始化表单事件
     */
    function initFormEvents() {
        const contactForm = document.querySelector('.contact-form');
        
        // 检查是否有联系表单
        if (!contactForm) return;
        
        // 表单提交
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 表单验证
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 模拟提交成功
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<span class="button-text">提交中</span><span class="button-icon"><i class="fas fa-spinner fa-spin"></i></span>';
            submitButton.disabled = true;
            
            // 模拟异步操作
            setTimeout(() => {
                // 重置表单
                contactForm.reset();
                
                // 恢复按钮
                submitButton.innerHTML = '<span class="button-text">已发送!</span><span class="button-icon"><i class="fas fa-check"></i></span>';
                
                // 一段时间后恢复原始状态
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    /**
     * 初始化部分动画
     */
    function initSectionAnimation() {
        // 为所有section添加动画类
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            if (!section.classList.contains('hero-section')) {
                section.classList.add('fade-in');
            }
        });
    }
    
    
    /**
     * 设置当前年份
     */
    function setCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    /**
     * 设置所有交互元素
     */
    function setupInteractiveElements() {
        // 确保鼠标指针元素存在
        if (!cursorDot || !cursorOutline) return;
        
        // 获取所有可交互元素（扩展列表以确保全覆盖）
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, .clickable, .tool-card, .social-link, .work-card, .nav-link, .skill-item, .easter-egg-trigger, .back-to-top, .theme-button');
        
        // 为每个元素添加鼠标事件
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorOutline.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorOutline.classList.remove('hover');
            });
            
            // 添加鼠标按下/抬起事件
            el.addEventListener('mousedown', () => {
                cursorDot.classList.add('active');
                cursorOutline.classList.add('active');
            });
            
            el.addEventListener('mouseup', () => {
                cursorDot.classList.remove('active');
                cursorOutline.classList.remove('active');
            });
            
            // 处理禁用状态
            if (el.disabled || el.classList.contains('disabled') || el.classList.contains('coming-soon')) {
                el.addEventListener('mouseenter', () => {
                    cursorDot.classList.add('disabled');
                    cursorOutline.classList.add('disabled');
                });
                
                el.addEventListener('mouseleave', () => {
                    cursorDot.classList.remove('disabled');
                    cursorOutline.classList.remove('disabled');
                });
            }
        });
        
        // 特别处理表单输入元素
        const formElements = document.querySelectorAll('input, textarea, select');
        formElements.forEach(el => {
            el.addEventListener('focus', () => {
                cursorDot.classList.add('focus');
                cursorOutline.classList.add('focus');
            });
            
            el.addEventListener('blur', () => {
                cursorDot.classList.remove('focus');
                cursorOutline.classList.remove('focus');
            });
        });
    }
})();
