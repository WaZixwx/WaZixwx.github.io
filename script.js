document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initQRParallax();
    initSteamCopy();
});

function initLoader() {
    const loader = document.querySelector('.loader');
    const loaderLeft = document.querySelector('.loader-line.left');
    const loaderRight = document.querySelector('.loader-line.right');
    const loaderPercentage = document.querySelector('.loader-percentage');
    const mainContent = document.querySelector('.main-content');

    let progress = 0;
    const maxProgress = 50;

    const interval = setInterval(() => {
        progress += Math.random() * 3;
        if (progress > 100) progress = 100;

        const leftWidth = (progress / 100) * maxProgress;
        const rightWidth = (progress / 100) * maxProgress;

        loaderLeft.style.width = leftWidth + '%';
        loaderRight.style.width = rightWidth + '%';
        loaderPercentage.textContent = Math.floor(progress) + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                mainContent.classList.add('visible');
            }, 300);
        }
    }, 50);

    window.addEventListener('load', () => {
        progress = 100;
        loaderLeft.style.width = maxProgress + '%';
        loaderRight.style.width = maxProgress + '%';
        loaderPercentage.textContent = '100%';
        
        setTimeout(() => {
            loader.classList.add('hidden');
            mainContent.classList.add('visible');
        }, 500);
    });
}

function initQRParallax() {
    const qqCard = document.getElementById('qqCard');
    const qrWrapper = document.getElementById('qrWrapper');

    if (!qqCard || !qrWrapper) return;

    qqCard.addEventListener('mousemove', (e) => {
        const rect = qqCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        qrWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    qqCard.addEventListener('mouseleave', () => {
        qrWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

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
    }, 2000);
}
