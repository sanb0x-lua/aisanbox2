function init() {
    // Создаем снежинки на фоне
    function createLines() {
        const linesContainer = document.getElementById('lines');
        if (!linesContainer) return;
        const lineCount = 5;

        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'line';
            line.style.left = Math.random() * 100 + 'vw';

            const size = Math.floor(Math.random() * 12) + 6;
            line.style.width = size + 'px';
            line.style.height = size + 'px';

            line.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
            const duration = Math.random() * 6 + 6;
            line.style.animationDuration = duration.toFixed(2) + 's';

            line.style.opacity = (Math.random() * 0.5 + 0.4).toFixed(2);
            if (Math.random() > 0.75) line.style.filter = 'blur(0.6px)';

            linesContainer.appendChild(line);

            setTimeout(() => {
                if (line.parentNode) line.remove();
            }, duration * 1000 + 2000);
        }
    }

    setInterval(createLines, 3500);
    createLines();

    // Background subtle movement
    function animateBackground(){
        const bg = document.querySelector('.animated-bg');
        if (!bg) return;
        let position = 0;
        setInterval(()=>{ position = (position + 1) % 10000; bg.style.backgroundPosition = `${position}px ${position}px`; }, 60);
    }
    animateBackground();

    // Логика для автоматического нажатия W в игре
    let isAutoPressActive = false;
    let autoPressInterval = null;
    const gameFrame = document.getElementById('gameFrame');
    const toggleBtn = document.getElementById('toggleBtn');
    const btnStatus = document.querySelector('.btn-status');

    function sendKeyToFrame(keyCode) {
        try {
            const event = new KeyboardEvent('keydown', {
                key: keyCode === 87 ? 'w' : 'W',
                code: 'KeyW',
                keyCode: 87,
                which: 87,
                bubbles: true,
                cancelable: true
            });
            
            if (gameFrame && gameFrame.contentDocument) {
                gameFrame.contentDocument.dispatchEvent(event);
                gameFrame.contentDocument.body.dispatchEvent(event);
            }
            
            // Также пытаемся через contentWindow
            if (gameFrame && gameFrame.contentWindow) {
                gameFrame.contentWindow.dispatchEvent(event);
                if (gameFrame.contentWindow.document) {
                    gameFrame.contentWindow.document.dispatchEvent(event);
                    gameFrame.contentWindow.document.body.dispatchEvent(event);
                }
            }
        } catch (e) {
            console.log('Невозможно отправить команду в iframe (возможно блокировка CORS)');
        }
    }

    function toggleAutoPress() {
        isAutoPressActive = !isAutoPressActive;
        
        if (isAutoPressActive) {
            toggleBtn.classList.add('active');
            btnStatus.textContent = 'Включено';
            
            // Нажимаем W каждые 5 секунд
            autoPressInterval = setInterval(() => {
                sendKeyToFrame(87); // 87 - код клавиши W
            }, 5000);
        } else {
            toggleBtn.classList.remove('active');
            btnStatus.textContent = 'Выключено';
            
            if (autoPressInterval) {
                clearInterval(autoPressInterval);
                autoPressInterval = null;
            }
        }
    }

    toggleBtn.addEventListener('click', toggleAutoPress);

    // Footer text
    const footerText = document.getElementById('footerText');
    if (footerText) {
        footerText.textContent = 'By Sanbox';
    }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();