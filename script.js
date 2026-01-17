// Phase definitions
const PHASES = [
    "2 sets of 3",
    "1 set of 3 + 1 run of 4",
    "1 set of 4 + 1 run of 4",
    "1 run of 7",
    "1 run of 8",
    "1 run of 9",
    "2 sets of 4",
    "7 cards of 1 color",
    "1 set of 5 + 1 set of 2",
    "1 set of 5 + 1 set of 3"
];

// Game state
let gameState = {
    players: [],
    currentRound: 1,
    gameStarted: false
};

// LocalStorage key
const STORAGE_KEY = 'phase10_game_state';

// Toast notification function
function showToast(message, type = 'error', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        console.error('Toast container not found');
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast-message';
    messageSpan.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => {
        toast.classList.add('slide-out');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    });
    
    toast.appendChild(messageSpan);
    toast.appendChild(closeBtn);
    toastContainer.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('slide-out');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }
    }, duration);
}

// Save game state to localStorage
function saveGameState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
        console.error('Error saving game state:', e);
    }
}

// Load game state from localStorage
function loadGameState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.gameStarted && parsed.players && parsed.players.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Error loading game state:', e);
    }
    return null;
}

// Clear game state from localStorage
function clearGameState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Error clearing game state:', e);
    }
}

// DOM elements
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const playerInputs = document.getElementById('player-inputs');
const addPlayerBtn = document.getElementById('add-player-btn');
const removePlayerBtn = document.getElementById('remove-player-btn');
const startGameBtn = document.getElementById('start-game-btn');
const navAddScore = document.getElementById('nav-add-score');
const currentDealerSpan = document.getElementById('current-dealer');
const playersStatus = document.getElementById('players-status');
const leaderboardItems = document.getElementById('leaderboard-items');
const nextPhaseCards = document.getElementById('next-phase-cards');
const roundModal = document.getElementById('round-modal');
const roundInputs = document.getElementById('round-inputs');
const submitRoundBtn = document.getElementById('submit-round-btn');
const cancelRoundBtn = document.getElementById('cancel-round-btn');
const modalRoundSpan = document.getElementById('modal-round');
const winnerScreen = document.getElementById('winner-screen');
const winnerName = document.getElementById('winner-name');
const winnerDetails = document.getElementById('winner-details');
const newGameBtn = document.getElementById('new-game-btn');
const homeTab = document.getElementById('home-tab');
const leaderboardTab = document.getElementById('leaderboard-tab');
const navHome = document.getElementById('nav-home');
const navLeaderboard = document.getElementById('nav-leaderboard');
const navNewGame = document.getElementById('nav-new-game');

// Initialize player inputs
let playerCount = 2;

// Tab switching
function switchTab(tabId) {
    // Hide all tabs
    homeTab.classList.remove('active');
    leaderboardTab.classList.remove('active');
    
    // Remove active class from all nav items
    navHome.classList.remove('active');
    navLeaderboard.classList.remove('active');
    
    // Show selected tab
    if (tabId === 'home-tab') {
        homeTab.classList.add('active');
        navHome.classList.add('active');
    } else if (tabId === 'leaderboard-tab') {
        leaderboardTab.classList.add('active');
        navLeaderboard.classList.add('active');
        // Update leaderboard when switching to it
        updateLeaderboard();
    }
}

// Tab navigation event listeners
navHome.addEventListener('click', () => switchTab('home-tab'));
navLeaderboard.addEventListener('click', () => switchTab('leaderboard-tab'));

// Update leaderboard function
function updateLeaderboard() {
    leaderboardItems.innerHTML = '';
    if (!gameState.players || gameState.players.length === 0) return;
    
    // Sort players by completed phases (highest first), then by score (lowest first)
    const sortedPlayers = [...gameState.players].sort((a, b) => {
        const aCompleted = a.phase - 1; // Completed phases = current phase - 1
        const bCompleted = b.phase - 1;
        if (bCompleted !== aCompleted) {
            return bCompleted - aCompleted;
        }
        return a.totalScore - b.totalScore;
    });

    sortedPlayers.forEach((player, index) => {
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = 'card leaderboard-item';
        // Completed phases = current phase - 1 (since phase is what they're working on)
        const completedPhases = player.phase - 1;
        const progressPercent = (completedPhases / 10) * 100;

        leaderboardItem.innerHTML = `
            <div class="card-body p-3 d-flex align-items-center gap-2">
                <span class="leaderboard-player-name fw-semibold" style="min-width: 80px;">${player.name}</span>
                <div class="progress flex-grow-1" style="height: 24px;">
                    <div class="progress-bar" style="width: ${progressPercent}%;"></div>
                </div>
                <span class="leaderboard-phase fw-bold" style="min-width: 25px; text-align: right;">${completedPhases}</span>
            </div>
        `;
        leaderboardItems.appendChild(leaderboardItem);
    });
}

// Add player button
addPlayerBtn.addEventListener('click', () => {
    if (playerCount < 6) {
        playerCount++;
        const inputGroup = document.createElement('div');
        inputGroup.className = 'mb-3';
        inputGroup.innerHTML = `
            <input type="text" class="setup-input" id="player${playerCount}" placeholder="Player ${playerCount}" required>
        `;
        playerInputs.appendChild(inputGroup);
        
        if (playerCount === 6) {
            addPlayerBtn.style.display = 'none';
        }
        if (playerCount > 2) {
            removePlayerBtn.style.display = 'inline-block';
        }
    }
});

// Remove player button
removePlayerBtn.addEventListener('click', () => {
    if (playerCount > 2) {
        const lastInput = playerInputs.lastElementChild;
        playerInputs.removeChild(lastInput);
        playerCount--;
        
        if (playerCount < 6) {
            addPlayerBtn.style.display = 'inline-block';
        }
        if (playerCount === 2) {
            removePlayerBtn.style.display = 'none';
        }
    }
});

// Start game
startGameBtn.addEventListener('click', () => {
    const players = [];
    let allValid = true;
    
    for (let i = 1; i <= playerCount; i++) {
        const input = document.getElementById(`player${i}`);
        const name = input.value.trim();
        
        if (!name) {
            allValid = false;
            input.style.borderColor = 'var(--danger-color)';
        } else {
            input.style.borderColor = 'var(--border-color)';
            players.push({
                name: name,
                phase: 1,
                totalScore: 0,
                completedPhase10: false
            });
        }
    }
    
    if (!allValid) {
        showToast('Please enter all player names', 'error');
        return;
    }
    
    gameState.players = players;
    gameState.currentRound = 1;
    gameState.gameStarted = true;
    
    saveGameState();
    
    setupScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    // Always switch to home tab when starting a new game
    switchTab('home-tab');
    updateGameDisplay();
});

// Update game display
function updateGameDisplay() {
    const dealerIndex = (gameState.currentRound - 1) % gameState.players.length;
    const dealer = gameState.players[dealerIndex];
    
    currentDealerSpan.textContent = dealer.name;
    
    // Determine the leader (highest phase, or lowest score if tied)
    const sortedPlayers = [...gameState.players].sort((a, b) => {
        if (b.phase !== a.phase) {
            return b.phase - a.phase; // Higher phase first
        }
        return a.totalScore - b.totalScore; // Lower score first if phases are equal
    });
    const leader = sortedPlayers[0];
    const leaderIndex = gameState.players.findIndex(p => p.name === leader.name);
    
    playersStatus.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const isLeader = index === leaderIndex;
        const colDiv = document.createElement('div');
        const playerCard = document.createElement('div');
        playerCard.className = `card player-card h-100 ${isLeader ? 'is-dealer border-primary' : ''}`;
        
        playerCard.innerHTML = `
            <div class="card-body p-3">
                <div class="player-name fw-bold mb-2">${player.name}${isLeader ? ' 👑' : ''}</div>
                <div class="player-score">
                    <span class="small text-muted">Points</span>
                    <span class="h5 mb-0">${player.totalScore}</span>
                </div>
            </div>
        `;
        
        colDiv.appendChild(playerCard);
        playersStatus.appendChild(colDiv);
    });
    
    // Update Next Phase section - Group players by phase
    nextPhaseCards.innerHTML = '';
    
    // Group players by phase
    const playersByPhase = {};
    gameState.players.forEach((player) => {
        if (!playersByPhase[player.phase]) {
            playersByPhase[player.phase] = [];
        }
        playersByPhase[player.phase].push(player);
    });
    
    // Sort phases in descending order and create cards
    const sortedPhases = Object.keys(playersByPhase).sort((a, b) => parseInt(b) - parseInt(a));
    
    sortedPhases.forEach((phaseNum) => {
        const players = playersByPhase[phaseNum];
        const colDiv = document.createElement('div');
        colDiv.className = 'col-12';
        const phaseCard = document.createElement('div');
        phaseCard.className = 'card phase-card h-100';
        
        const playerNames = players.map(p => `<div>• ${p.name}</div>`).join('');
        
        phaseCard.innerHTML = `
            <div class="phase-card-content">
                <div class="phase-card-top">
                    <div class="phase-card-left">
                        <span class="phase-number">Phase - ${phaseNum}</span>
                    </div>
                    <div class="phase-card-right">
                        <div class="phase-players">${playerNames}</div>
                    </div>
                </div>
                <div class="phase-card-bottom">
                    <div class="phase-description">${PHASES[phaseNum - 1]}</div>
                </div>
            </div>
        `;
        colDiv.appendChild(phaseCard);
        nextPhaseCards.appendChild(colDiv);
    });
    
    // Check for winner
    checkWinner();
}

// Add score button (bottom nav + button)
navAddScore.addEventListener('click', () => {
    showRoundModal();
});

// Show round modal
function showRoundModal() {
    modalRoundSpan.textContent = gameState.currentRound;
    roundInputs.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const inputItem = document.createElement('div');
        inputItem.className = 'score-input-card';
        
        inputItem.innerHTML = `
            <div class="score-player-name">${player.name}</div>
            <input type="number" class="score-input" id="score-${index}" min="0" value="0" required>
            <div class="score-phase-toggle">
                <span class="score-phase-label">Phase ?</span>
                <label class="score-toggle-switch">
                    <input type="checkbox" id="completed-${index}">
                    <span class="score-toggle-slider"></span>
                </label>
            </div>
        `;
        
        roundInputs.appendChild(inputItem);
    });
    
    const modal = new bootstrap.Modal(roundModal);
    modal.show();
}

// Submit round scores
submitRoundBtn.addEventListener('click', () => {
    let allValid = true;
    const scores = [];
    const completions = [];
    
    gameState.players.forEach((player, index) => {
        const scoreInput = document.getElementById(`score-${index}`);
        const completedInput = document.getElementById(`completed-${index}`);
        
        const score = parseInt(scoreInput.value);
        if (isNaN(score) || score < 0) {
            allValid = false;
            scoreInput.style.borderColor = 'var(--danger-color)';
        } else {
            scoreInput.style.borderColor = 'var(--border-color)';
            scores.push(score);
            completions.push(completedInput.checked);
        }
    });
    
    if (!allValid) {
        showToast('Please enter valid scores (0 or greater)', 'error');
        return;
    }
    
    // Update player scores and phases
    gameState.players.forEach((player, index) => {
        player.totalScore += scores[index];
        
        if (completions[index]) {
            if (player.phase < 11) {
                player.phase++;
            }
        }
        
        // Player wins if they complete phase 10 (phase becomes 11)
        if (player.phase === 11 && completions[index]) {
            player.completedPhase10 = true;
        }
    });
    
    // Move to next round
    gameState.currentRound++;
    
    saveGameState();
    
    const modal = bootstrap.Modal.getInstance(roundModal);
    modal.hide();
    updateGameDisplay();
});

// Cancel round modal
cancelRoundBtn.addEventListener('click', () => {
    const modal = bootstrap.Modal.getInstance(roundModal);
    modal.hide();
});


// Check for winner
function checkWinner() {
    const completedPlayers = gameState.players.filter(p => p.completedPhase10);
    
    if (completedPlayers.length > 0) {
        // Sort by score (lowest first)
        completedPlayers.sort((a, b) => a.totalScore - b.totalScore);
        
        const winner = completedPlayers[0];
        const tiedWinners = completedPlayers.filter(p => p.totalScore === winner.totalScore);
        
        if (tiedWinners.length === 1) {
            winnerName.textContent = winner.name;
            winnerDetails.textContent = `Completed Phase 10 with a score of ${winner.totalScore}!`;
        } else {
            winnerName.textContent = tiedWinners.map(p => p.name).join(' & ');
            winnerDetails.textContent = `Tied with Phase 10 completed! Score: ${winner.totalScore}`;
        }
        
        winnerScreen.style.display = 'flex';
    }
}

// Function to reset game and show setup
function resetGame() {
    // Reset game state
    gameState = {
        players: [],
        currentRound: 1,
        gameStarted: false
    };
    
    clearGameState();
    
    // Reset player inputs
    playerCount = 2;
    playerInputs.innerHTML = `
        <div class="mb-3">
            <input type="text" class="setup-input" id="player1" placeholder="Player 1" required>
        </div>
        <div class="mb-3">
            <input type="text" class="setup-input" id="player2" placeholder="Player 2" required>
        </div>
    `;
    
    addPlayerBtn.style.display = 'inline-block';
    removePlayerBtn.style.display = 'none';
    
    winnerScreen.style.display = 'none';
    gameScreen.classList.remove('active');
    setupScreen.classList.add('active');
    
    // Always switch to home tab when resetting
    switchTab('home-tab');
}

// New game button (from winner screen)
newGameBtn.addEventListener('click', () => {
    resetGame();
});

// New game button (from bottom nav)
navNewGame.addEventListener('click', () => {
    resetGame();
});

// Initialize: Load saved game state on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedState = loadGameState();
    
    if (savedState) {
        gameState = savedState;
        
        // Show game screen instead of setup screen
        setupScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        // Always switch to home tab when restoring game
        switchTab('home-tab');
        
        // Restore winner screen if game is complete
        const completedPlayers = gameState.players.filter(p => p.completedPhase10);
        if (completedPlayers.length > 0) {
            checkWinner();
        } else {
            winnerScreen.style.display = 'none';
        }
        
        updateGameDisplay();
    }
});
