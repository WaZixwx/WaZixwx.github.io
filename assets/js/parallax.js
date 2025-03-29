/**
 * 视差滚动效果
 * 
 * 实现页面滚动时的视差效果，增强页面深度感
 */
(function() {
    // 获取相关元素
    const parallaxBg = document.querySelector('.parallax-bg');
    const sections = document.querySelectorAll('section');
    const skills = document.querySelectorAll('.skill-item');
    const workCards = document.querySelectorAll('.work-card');
    const toolCards = document.querySelectorAll('.tool-card');
    const floatingShapes = document.querySelectorAll('.floating-shape');
    
    // 上次滚动位置
    let lastScrollTop = 0;
    
    // 初始化Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // 监听所有section
    sections.forEach((section, index) => {
        // 第一个section (hero) 不需要动画
        if (index > 0) {
            observer.observe(section);
        }
    });
    
    // 监听技能项目
    skills.forEach((skill, index) => {
        skill.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(skill);
    });
    
    // 监听作品卡片
    workCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // 监听工具卡片
    toolCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    /**
     * 滚动处理函数
     */
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 视差背景效果
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${scrollTop * 0.5}px)`;
            parallaxBg.style.filter = `blur(${Math.min(scrollTop / 1000 * 5, 5)}px)`;
        }
        
        // 浮动形状动画增强
        floatingShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.05;
            const yPos = Math.sin(scrollTop * speed) * 15;
            const xPos = Math.cos(scrollTop * speed) * 15;
            shape.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${scrollTop * speed * 0.5}deg)`;
        });
        
        // 导航栏显示/隐藏
        const navbar = document.querySelector('.navbar');
        if (scrollTop > 100) {
            // 向下滚动隐藏，向上滚动显示
            if (scrollTop > lastScrollTop) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
        } else {
            navbar.classList.remove('hidden');
        }
        
        // 回到顶部按钮
        const backToTop = document.querySelector('.back-to-top');
        if (scrollTop > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
        
        // 更新上次滚动位置
        lastScrollTop = scrollTop;
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);
    
    // 初始执行一次
    handleScroll();
    
    /**
     * 鼠标移动视差效果
     */
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        // 英雄区域鼠标跟随效果
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
        }
        
        // 浮动形状鼠标跟随效果
        floatingShapes.forEach((shape, index) => {
            const speed = (index + 1) * 2;
            shape.style.transform = `translate(${mouseX * speed * 10}px, ${mouseY * speed * 10}px)`;
        });
    });
})();
