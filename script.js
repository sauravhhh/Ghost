// Ghost Scanner Pro JavaScript

// Global variables
let isScanning = false;
let scanInterval;
let ghostInterval;
let emfInterval;
let audioContext;
let sensitivity = 50;
let scanMode = 'standard';
let soundEnabled = true;
let ghostCount = 0;

// Ghost types with different properties
const ghostTypes = [
    { name: 'Poltergeist', danger: 'High', color: '#ff0000', emf: 8, svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,10 C30,10 15,25 15,45 C15,65 30,80 50,80 C70,80 85,65 85,45 C85,25 70,10 50,10 Z M50,20 C65,20 75,30 75,45 C75,60 65,70 50,70 C35,70 25,60 25,45 C25,30 35,20 50,20 Z M40,50 C40,55 45,60 50,60 C55,60 60,55 60,50 C60,45 55,40 50,40 C45,40 40,45 40,50 Z" fill="#ff0000" opacity="0.8"/></svg>' },
    { name: 'Shadow Figure', danger: 'Medium', color: '#ff8800', emf: 5, svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,10 C35,10 25,20 25,35 C25,50 35,60 50,60 C65,60 75,50 75,35 C75,20 65,10 50,10 Z M30,70 C30,70 30,90 50,90 C70,90 70,70 70,70 C70,70 60,80 50,80 C40,80 30,70 30,70 Z" fill="#ff8800" opacity="0.8"/></svg>' },
    { name: 'Orb', danger: 'Low', color: '#00ff00', emf: 2, svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="30" fill="#00ff00" opacity="0.8"/><circle cx="50" cy="50" r="20" fill="#ffffff" opacity="0.5"/></svg>' },
    { name: 'Apparition', danger: 'High', color: '#ff00ff', emf: 9, svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,10 C30,10 15,25 15,45 C15,65 30,80 50,80 C70,80 85,65 85,45 C85,25 70,10 50,10 Z M50,20 C65,20 75,30 75,45 C75,60 65,70 50,70 C35,70 25,60 25,45 C25,30 35,20 50,20 Z M40,50 C40,55 45,60 50,60 C55,60 60,55 60,50 C60,45 55,40 50,40 C45,40 40,45 40,50 Z" fill="#ff00ff" opacity="0.8"/></svg>' },
    { name: 'Wisp', danger: 'Low', color: '#00ffff', emf: 3, svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,10 C40,10 30,20 30,30 C30,40 40,50 50,50 C60,50 70,40 70,30 C70,20 60,10 50,10 Z M40,60 C40,60 40,80 50,80 C60,80 60,60 60,60 C60,60 55,65 50,65 C45,65 40,60 40,60 Z" fill="#00ffff" opacity="0.8"/></svg>' },
    { name: 'Demon', danger: 'Extreme', color: '#880000', emf: 10, svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,10 C30,10 15,25 15,45 C15,65 30,80 50,80 C70,80 85,65 85,45 C85,25 70,10 50,10 Z M40,50 C40,55 45,60 50,60 C55,60 60,55 60,50 C60,45 55,40 50,40 C45,40 40,45 40,50 Z M30,20 C30,20 25,25 25,30 C25,35 30,40 35,40 C40,40 45,35 45,30 C45,25 40,20 35,20 C32,20 30,20 30,20 Z M70,20 C70,20 65,20 65,20 C60,20 55,25 55,30 C55,35 60,40 65,40 C70,40 75,35 75,30 C75,25 70,20 70,20 Z" fill="#880000" opacity="0.8"/></svg>' },
    { name: 'Spirit', danger: 'Medium', color: '#ffff00', emf: 6, svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,10 C35,10 25,20 25,35 C25,50 35,60 50,60 C65,60 75,50 75,35 C75,20 65,10 50,10 Z M30,70 C30,70 30,90 50,90 C70,90 70,70 70,70 C70,70 60,80 50,80 C40,80 30,70 30,70 Z" fill="#ffff00" opacity="0.8"/></svg>' },
    { name: 'Phantom', danger: 'High', color: '#ff0088', emf: 7, svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,10 C30,10 15,25 15,45 C15,65 30,80 50,80 C70,80 85,65 85,45 C85,25 70,10 50,10 Z M50,20 C65,20 75,30 75,45 C75,60 65,70 50,70 C35,70 25,60 25,45 C25,30 35,20 50,20 Z M40,50 C40,55 45,60 50,60 C55,60 60,55 60,50 C60,45 55,40 50,40 C45,40 40,45 40,50 Z" fill="#ff0088" opacity="0.8"/></svg>' }
];

// Initialize audio context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play sound effect
function playSound(frequency, duration) {
    if (!soundEnabled || !audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Radar canvas setup
const canvas = document.getElementById('radarCanvas');
const ctx = canvas.getContext('2d');

// Make canvas responsive
function resizeCanvas() {
    const container = document.querySelector('.radar-container');
    const size = Math.min(container.offsetWidth, container.offsetHeight);
    canvas.width = size;
    canvas.height = size;
    drawRadar();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Draw radar grid
function drawRadar() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw circles
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * i, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.stroke();
    }
    
    // Draw lines
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.stroke();
}

// Create ghost dot
function createGhostDot() {
    const ghost = ghostTypes[Math.floor(Math.random() * ghostTypes.length)];
    const container = document.querySelector('.radar-container');
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;
    const maxRadius = Math.min(centerX, centerY) - 20;
    
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * maxRadius + 20;
    const x = centerX + Math.cos(angle) * distance - 5;
    const y = centerY + Math.sin(angle) * distance - 5;
    
    // Create dot
    const dot = document.createElement('div');
    dot.className = 'ghost-dot';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    dot.style.background = ghost.color;
    dot.style.boxShadow = `0 0 10px ${ghost.color}`;
    
    document.getElementById('ghostDots').appendChild(dot);
    
    // Create ghost figure
    const figure = document.createElement('div');
    figure.className = 'ghost-figure';
    figure.innerHTML = ghost.svg;
    figure.style.left = (x - 15) + 'px';
    figure.style.top = (y - 15) + 'px';
    figure.style.width = '40px';
    figure.style.height = '40px';
    
    document.getElementById('ghostFigures').appendChild(figure);
    
    // Remove dot and figure after animation
    setTimeout(() => {
        dot.remove();
        figure.remove();
    }, 3000);
    
    // Add to log
    addToLog(ghost);
    
    // Play detection sound
    playSound(800, 0.2);
    
    // Trigger static effect
    triggerStatic();
}

// Add ghost to detection log
function addToLog(ghost) {
    ghostCount++;
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = 'ghost-card rounded-lg p-4 flex items-center justify-between';
    
    const dangerColor = {
        'Low': 'text-green-400',
        'Medium': 'text-yellow-400',
        'High': 'text-orange-400',
        'Extreme': 'text-red-400'
    };
    
    logEntry.innerHTML = `
        <div class="flex items-center">
            <div class="w-8 h-8 mr-3" style="filter: drop-shadow(0 0 5px ${ghost.color});">${ghost.svg}</div>
            <div>
                <h4 class="font-semibold">${ghost.name} #${ghostCount}</h4>
                <p class="text-sm text-gray-400">Detected at ${time}</p>
            </div>
        </div>
        <div class="text-right">
            <p class="${dangerColor[ghost.danger]} font-semibold">${ghost.danger}</p>
            <p class="text-sm text-gray-400">EMF: ${ghost.emf}</p>
        </div>
    `;
    
    const log = document.getElementById('detectionLog');
    if (log.children[0]?.classList.contains('text-gray-500')) {
        log.innerHTML = '';
    }
    log.insertBefore(logEntry, log.firstChild);
    
    // Limit log entries
    if (log.children.length > 10) {
        log.removeChild(log.lastChild);
    }
}

// Update EMF meter
function updateEMF() {
    const baseEMF = Math.random() * 3;
    const ghostEMF = isScanning ? Math.random() * 7 : 0;
    const totalEMF = Math.min(10, baseEMF + ghostEMF);
    
    document.getElementById('emfLevel').style.width = (totalEMF * 10) + '%';
    
    // Play EMF sound if high
    if (totalEMF > 7 && Math.random() > 0.8) {
        playSound(200 + totalEMF * 50, 0.1);
    }
}

// Trigger static effect
function triggerStatic() {
    const staticEffect = document.getElementById('staticEffect');
    staticEffect.classList.add('static-active');
    setTimeout(() => staticEffect.classList.remove('static-active'), 200);
}

// Start scanning
function startScanning() {
    initAudio();
    isScanning = true;
    
    // Update UI
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
    document.getElementById('statusIndicator').classList.remove('status-inactive');
    document.getElementById('statusIndicator').classList.add('status-active');
    document.getElementById('statusText').textContent = 'Active';
    
    // Play start sound
    playSound(440, 0.3);
    
    // Start ghost detection based on sensitivity and mode
    const detectionRate = {
        'standard': 3000,
        'aggressive': 1500,
        'stealth': 5000
    };
    
    const rate = detectionRate[scanMode] * (100 / sensitivity);
    
    ghostInterval = setInterval(() => {
        if (Math.random() * 100 < sensitivity) {
            createGhostDot();
        }
    }, rate);
    
    // Start EMF updates
    emfInterval = setInterval(updateEMF, 500);
    
    // Radar animation
    scanInterval = setInterval(drawRadar, 100);
}

// Stop scanning
function stopScanning() {
    isScanning = false;
    
    // Clear intervals
    clearInterval(ghostInterval);
    clearInterval(emfInterval);
    clearInterval(scanInterval);
    
    // Update UI
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('statusIndicator').classList.remove('status-active');
    document.getElementById('statusIndicator').classList.add('status-inactive');
    document.getElementById('statusText').textContent = 'Inactive';
    
    // Clear ghost dots and figures
    document.getElementById('ghostDots').innerHTML = '';
    document.getElementById('ghostFigures').innerHTML = '';
    
    // Play stop sound
    playSound(220, 0.3);
}

// Event listeners
document.getElementById('startBtn').addEventListener('click', startScanning);
document.getElementById('stopBtn').addEventListener('click', stopScanning);

document.getElementById('sensitivitySlider').addEventListener('input', (e) => {
    sensitivity = e.target.value;
    document.getElementById('sensitivityValue').textContent = sensitivity;
});

document.getElementById('scanMode').addEventListener('change', (e) => {
    scanMode = e.target.value;
});

document.getElementById('soundToggle').addEventListener('change', (e) => {
    soundEnabled = e.target.checked;
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (isScanning) {
            stopScanning();
        } else {
            startScanning();
        }
    }
});
