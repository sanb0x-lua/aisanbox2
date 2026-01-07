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

    function simulateKeyPressInIframe() {
        try {
            // Пытаемся отправить событие в iframe
            if (gameFrame && gameFrame.contentWindow) {
                const keyDownEvent = new KeyboardEvent('keydown', {
                    key: 'w',
                    code: 'KeyW',
                    keyCode: 87,
                    which: 87,
                    charCode: 0,
                    bubbles: true,
                    cancelable: true
                });
                
                const keyUpEvent = new KeyboardEvent('keyup', {
                    key: 'w',
                    code: 'KeyW',
                    keyCode: 87,
                    which: 87,
                    charCode: 0,
                    bubbles: true,
                    cancelable: true
                });
                
                // Отправляем в contentWindow
                gameFrame.contentWindow.dispatchEvent(keyDownEvent);
                if (gameFrame.contentWindow.document) {
                    gameFrame.contentWindow.document.dispatchEvent(keyDownEvent);
                    gameFrame.contentWindow.document.body?.dispatchEvent(keyDownEvent);
                }
                
                // Отправляем keyUp через короткую задержку
                setTimeout(() => {
                    gameFrame.contentWindow.dispatchEvent(keyUpEvent);
                    if (gameFrame.contentWindow.document) {
                        gameFrame.contentWindow.document.dispatchEvent(keyUpEvent);
                        gameFrame.contentWindow.document.body?.dispatchEvent(keyUpEvent);
                    }
                }, 50);
            }
        } catch (e) {
            // Iframe может блокировать события из-за CORS
            console.log('Невозможно отправить событие в iframe');
        }
    }

    function toggleAutoPress() {
        isAutoPressActive = !isAutoPressActive;
        
        if (isAutoPressActive) {
            toggleBtn.classList.add('active');
            btnStatus.textContent = 'Включено';
            
            // Нажимаем W каждые 2 секунды
            autoPressInterval = setInterval(() => {
                simulateKeyPressInIframe();
            }, 2000);
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