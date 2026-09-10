let currentSpeed = 800;
let minSpeed = 120;
let speedInterval = null;
let loopTimeout = null;
let crashTimer = null;
let progressInterval = null;
let clickCount = 0;
let clickTimer = null;
let isSequenceStarted = false;

const alertMessages = [
    "SYSTEM OVERFLOW",
    "Memory Leaking...",
    "CRITICAL CORRUPTION",
    "Firewall Destroyed"
];

// Attachement sécurisé des clics dès que la page est chargée
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("start-trigger-btn").addEventListener("click", initiateSequence);
    
    // Bloque la soumission par défaut pour gérer la touche Entrée et le clic sur la flèche proprement
    document.getElementById("login-form").addEventListener("submit", function(event) {
        event.preventDefault(); 
        handlePasswordValidation(); // Ne s'exécute QUE si on presse Entrée ou qu'on clique sur la flèche
    });
});

function initiateSequence() {
    if (isSequenceStarted) return;
    isSequenceStarted = true;
    
    document.getElementById('game-launcher').style.display = 'none';
    
    setTimeout(function() {
        const zone = document.getElementById('simulation-zone');
        const bgTrigger = document.getElementById('emergency-background-trigger');
        zone.style.display = 'block';
        
        bgTrigger.addEventListener('click', handleEmergencyTap);
        runVariableLoop();
        
        speedInterval = setInterval(function() {
            if (currentSpeed > minSpeed) {
                currentSpeed -= 150;
                if (currentSpeed < minSpeed) currentSpeed = minSpeed;
                runVariableLoop();
            } else {
                clearInterval(speedInterval);
            }
        }, 4000);

        crashTimer = setTimeout(triggerBlueScreenOfDeath, 25000);
    }, 1500);
}

function handleEmergencyTap() {
    clickCount++;
    clearTimeout(clickTimer);
    if (clickCount === 3) {
        stopSimulation();
        clickCount = 0;
    } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 400);
    }
}

// Touche E de secours toujours active
window.addEventListener('keydown', function(e) {
    if (e.key === 'e' || e.key === 'E') {
        stopSimulation();
    }
});

function runVariableLoop() {
    if (loopTimeout) clearTimeout(loopTimeout);
    function loop() {
        createWarningWindow();
        loopTimeout = setTimeout(loop, currentSpeed);
    }
    loopTimeout = setTimeout(loop, currentSpeed);
}

function createWarningWindow() {
    const zone = document.getElementById('simulation-zone');
    if (!zone || zone.style.display === 'none') return;

    const win = document.createElement('div');
    win.className = 'fake-window';
    
    const windowWidth = 280;
    const windowHeight = 90;
    const posX = Math.random() * (window.innerWidth - windowWidth);
    const posY = Math.random() * (window.innerHeight - windowHeight - 60) + 50; 
    
    win.style.left = Math.max(0, posX) + 'px';
    win.style.top = Math.max(0, posY) + 'px';
    
    const randomMessage = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    
    win.innerHTML = `
        <div class="window-header">
            <div class="header-left">
                <div class="microsoft-logo">
                    <div class="logo-square sq-red"></div>
                    <div class="logo-square sq-green"></div>
                    <div class="logo-square sq-blue"></div>
                    <div class="logo-square sq-yellow"></div>
                </div>
                <span>Système Malveillant</span>
            </div>
            <span class="close-btn" id="trap-close-btn">✕</span>
        </div>
        <div class="window-body">
            <span class="warning-sign">☠</span>
            <div class="vertical-divider"></div>
            <span>${randomMessage}</span>
        </div>
    `;
    
    win.querySelector('#trap-close-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        triggerTrapEffect();
    });
    
    zone.appendChild(win);
    zone.classList.remove('shake-effect');
    void zone.offsetWidth;
    zone.classList.add('shake-effect');
}

function triggerTrapEffect() {
    const zone = document.getElementById('simulation-zone');
    zone.classList.remove('blood-flash');
    void zone.offsetWidth;
    zone.classList.add('blood-flash');
    createWarningWindow();
    createWarningWindow();
}

function triggerBlueScreenOfDeath() {
    clearTimeout(loopTimeout);
    clearInterval(speedInterval);
    
    document.getElementById('simulation-zone').style.display = 'none';
    const bsod = document.getElementById('bsod-screen');
    bsod.style.display = 'flex';
    bsod.addEventListener('click', handleEmergencyTap);
    
    let progress = 0;
    document.getElementById('progress-val').innerText = progress;
    
    progressInterval = setInterval(function() {
        if (progress < 100) {
            progress += 1; 
            document.getElementById('progress-val').innerText = progress;
        } else {
            clearInterval(progressInterval);
            bsod.style.display = 'none';
            triggerFakeBootScreen();
        }
    }, 350); 
}

function triggerFakeBootScreen() {
    const bootScreen = document.getElementById('boot-screen');
    bootScreen.style.display = 'flex';
    bootScreen.addEventListener('click', handleEmergencyTap);
    
    setTimeout(function() {
        bootScreen.style.display = 'none';
        triggerFakeLoginScreen();
    }, 10000);
}

function triggerFakeLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    loginScreen.style.display = 'flex';
    
    const oldErr = document.getElementById('chromeos-err-msg');
    if (oldErr) oldErr.remove();
    
    const inputWrapper = document.querySelector('.chromeos-input-wrapper');
    inputWrapper.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    
    document.getElementById('pwd-field').value = '';
    document.getElementById('pwd-field').focus();
    
    loginScreen.addEventListener('click', function(e) {
        if (e.target === loginScreen) handleEmergencyTap();
    });
}

// 🔥 CORRECTIF : La validation attend le déclenchement final par Entrée ou clic Flèche
function handlePasswordValidation() {
    const passwordInput = document.getElementById('pwd-field').value; // Plus de coupure en cours d'écriture
    const inputWrapper = document.querySelector('.chromeos-input-wrapper');
    const userCard = document.querySelector('.chromeos-user-card');
    
    const oldErr = document.getElementById('chromeos-err-msg');
    if (oldErr) oldErr.remove();

    if (passwordInput === "") {
        // Bloqué : l'écran reste affiché si le champ est vide au moment de valider
        if (navigator.vibrate) {
            navigator.vibrate(300);
        }
        
        inputWrapper.style.border = '1px solid #ff3b30';
        
        const errorMsg = document.createElement('div');
        errorMsg.id = 'chromeos-err-msg';
        errorMsg.innerText = 'Password failed';
        errorMsg.style.color = '#ff3b30';
        errorMsg.style.fontSize = '13px';
        errorMsg.style.marginTop = '12px';
        errorMsg.style.fontWeight = '500';
        
        userCard.appendChild(errorMsg);
        
        inputWrapper.style.animation = 'none';
        void inputWrapper.offsetWidth;
        inputWrapper.style.animation = 'screenShake 0.15s ease-in-out';
    } else {
        // Libération complète : se ferme UNIQUEMENT quand du texte est présent et qu'on presse Entrée / Flèche
        stopSimulation();
    }
}

function stopSimulation() {
    clearTimeout(loopTimeout);
    clearTimeout(crashTimer);
    clearInterval(speedInterval);
    clearInterval(progressInterval);
    currentSpeed = 800;
    isSequenceStarted = false;
    
    document.getElementById('bsod-screen').removeEventListener('click', handleEmergencyTap);
    document.getElementById('boot-screen').removeEventListener('click', handleEmergencyTap);
    
    document.getElementById('bsod-screen').style.display = 'none';
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'none';
    
    const zone = document.getElementById('simulation-zone');
    zone.style.display = 'none';
    zone.innerHTML = '<div id="emergency-background-trigger"></div>'; 
    
    document.getElementById('game-launcher').style.display = 'block';
}
