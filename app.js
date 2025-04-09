let selectedDisk = null;
let moveCount = 0;
let startTime = null;
let timerInterval = null;
let diskCount = 3;
let gameWon = false;

// Elementos del DOM
const towers = document.querySelectorAll('.tower');
const diskContainers = document.querySelectorAll('.disk-container');
const resetButton = document.getElementById('reset');
const diskCountSelect = document.getElementById('diskCount');
const movesDisplay = document.getElementById('moves');
const minMovesDisplay = document.getElementById('min-moves');
const timeDisplay = document.getElementById('time');
const winModal = document.getElementById('winModal');
const finalMovesDisplay = document.getElementById('final-moves');
const finalTimeDisplay = document.getElementById('final-time');
const playAgainButton = document.getElementById('play-again');

// Colores para los discos
const diskColors = [
    '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', 
    '#3498db', '#9b59b6', '#1abc9c'
];

// Inicializar juego
initGame();

// Event listeners
resetButton.addEventListener('click', resetGame);
diskCountSelect.addEventListener('change', function() {
    diskCount = parseInt(this.value);
    resetGame();
});

playAgainButton.addEventListener('click', function() {
    winModal.style.display = 'none';
    resetGame();
});

towers.forEach(tower => {
    tower.addEventListener('click', handleTowerClick);
});

// Funciones
function initGame() {
    createDisks();
    updateMinMovesDisplay();
    startTimer();
}

function createDisks() {
    // Limpiar todos los contenedores de discos
    diskContainers.forEach(container => {
        container.innerHTML = '';
    });
    
    // Crear discos en la primera torre
    const container = document.getElementById('disks1');
    
    for (let i = diskCount; i >= 1; i--) {
        const disk = document.createElement('div');
        disk.className = 'disk';
        disk.dataset.size = i;
        
        // Calcular ancho basado en tamaño
        const width = 40 + (i * 20);
        disk.style.width = `${width}px`;
        disk.style.backgroundColor = diskColors[i - 1];
        
        // Opcional: número dentro del disco
        disk.textContent = i;
        
        container.appendChild(disk);
    }
}

function updateMinMovesDisplay() {
    const minMoves = Math.pow(2, diskCount) - 1;
    minMovesDisplay.textContent = minMoves;
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    startTime = new Date();
    
    timerInterval = setInterval(function() {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
        const seconds = (elapsedTime % 60).toString().padStart(2, '0');
        
        timeDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function handleTowerClick(event) {
    if (gameWon) return;
    
    const tower = event.currentTarget;
    const towerId = tower.id;
    const diskContainer = tower.querySelector('.disk-container');
    const disks = diskContainer.querySelectorAll('.disk');
    
    // Si no hay disco seleccionado, intenta seleccionar el disco superior de esta torre
    if (!selectedDisk) {
        if (disks.length === 0) return; // No hay discos en esta torre
        
        const topDisk = disks[disks.length - 1];
        selectedDisk = topDisk;
        topDisk.classList.add('selected');
    } else {
        // Ya hay un disco seleccionado, intenta moverlo a esta torre
        const selectedSize = parseInt(selectedDisk.dataset.size);
        
        // Verificar si el movimiento es válido
        let isValidMove = true;
        
        if (disks.length > 0) {
            const topDisk = disks[disks.length - 1];
            const topSize = parseInt(topDisk.dataset.size);
            
            if (selectedSize >= topSize) {
                isValidMove = false;
            }
        }
        
        if (isValidMove) {
            // Mover disco
            selectedDisk.classList.remove('selected');
            const oldContainer = selectedDisk.parentElement;
            diskContainer.appendChild(selectedDisk);
            
            // Incrementar contador de movimientos
            moveCount++;
            movesDisplay.textContent = moveCount;
            
            // Verificar si el juego se ha completado
            checkWinCondition();
        } else {
            // Cancelar selección si el movimiento no es válido
            selectedDisk.classList.remove('selected');
        }
        
        selectedDisk = null;
    }
}

function checkWinCondition() {
    const tower3Container = document.getElementById('disks3');
    const disksInTower3 = tower3Container.querySelectorAll('.disk');
    
    if (disksInTower3.length === diskCount) {
        gameWon = true;
        clearInterval(timerInterval);
        
        setTimeout(() => {
            showWinModal();
            createConfetti();
        }, 500);
    }
}

function showWinModal() {
    finalMovesDisplay.textContent = moveCount;
    finalTimeDisplay.textContent = timeDisplay.textContent;
    winModal.style.display = 'flex';
}

function createConfetti() {
    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Posición inicial aleatoria
        confetti.style.left = `${Math.random() * 100}%`;
        
        // Tamaño aleatorio
        const size = Math.random() * 8 + 4;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Retraso aleatorio en la animación
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        document.body.appendChild(confetti);
        
        // Eliminar el confetti después de la animación
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

function resetGame() {
    selectedDisk = null;
    moveCount = 0;
    gameWon = false;
    movesDisplay.textContent = '0';
    
    clearInterval(timerInterval);
    startTimer();
    
    createDisks();
    updateMinMovesDisplay();
}