let computer;
let userGuess = [];
let usernumberUpdate = document.getElementById("zoneheading");
let userinputnumber = document.getElementById("inputbox");
let maxGuess;
let currentDifficulty = '';
let hintsUsed = 0;
let maxHints = 2;
let timerInterval;
let startTime;
let bestTimes = { easy: null, medium: null, hard: null };

// Audio elements
let click = new Audio("assets/click.wav");
let win = new Audio("assets/win.wav");
let lose = new Audio("assets/lose.wav");

// Initialize game
const init = () => {
    computer = Math.floor(Math.random() * 100) + 1;
    document.getElementById("newgame").style.display = "none";
    document.getElementById("playzone").style.display = "none";
    loadBestScores();
    loadLeaderboard();
};

// Load best scores from localStorage
const loadBestScores = () => {
    const savedScores = localStorage.getItem('bestTimes');
    if (savedScores) {
        bestTimes = JSON.parse(savedScores);
    }
};

// Save best scores to localStorage
const saveBestScore = (difficulty, time, attempts) => {
    const leaderboard = getLeaderboard();
    const entry = {
        time: time,
        attempts: attempts,
        date: new Date().toISOString()
    };
    
    if (!leaderboard[difficulty]) {
        leaderboard[difficulty] = [];
    }
    
    leaderboard[difficulty].push(entry);
    leaderboard[difficulty].sort((a, b) => {
        if (a.attempts === b.attempts) {
            return a.time - b.time;
        }
        return a.attempts - b.attempts;
    });
    
    // Keep only top 10
    leaderboard[difficulty] = leaderboard[difficulty].slice(0, 10);
    
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
};

// Get leaderboard from localStorage
const getLeaderboard = () => {
    const saved = localStorage.getItem('leaderboard');
    return saved ? JSON.parse(saved) : { easy: [], medium: [], hard: [] };
};

// Load leaderboard
const loadLeaderboard = () => {
    const leaderboard = getLeaderboard();
    return leaderboard;
};

// Start game
const startGame = () => {
    document.getElementById("playzone").style.display = "flex";
    document.getElementById("container").style.display = "none";
    document.getElementById("difficulty").innerHTML = currentDifficulty.toUpperCase();
    document.getElementById("attempts").innerHTML = `0 / ${maxGuess}`;
    click.play();
    startTimer();
    updateBestScoreDisplay();
};

// Timer functionality
const startTimer = () => {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById("timer").innerHTML = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerInterval);
    return Math.floor((Date.now() - startTime) / 1000);
};

// Update best score display
const updateBestScoreDisplay = () => {
    const leaderboard = getLeaderboard();
    const scores = leaderboard[currentDifficulty];
    if (scores && scores.length > 0) {
        const best = scores[0];
        const minutes = Math.floor(best.time / 60);
        const seconds = best.time % 60;
        document.getElementById("bestScore").innerHTML = 
            `${best.attempts} attempts in ${minutes}:${String(seconds).padStart(2, '0')}`;
    } else {
        document.getElementById("bestScore").innerHTML = "-";
    }
};

// Start new game
const startnewgame = () => {
    document.getElementById("newgame").style.display = "flex";
    document.getElementById("inputbox").style.display = "none";
    document.getElementById("hintBtn").style.display = "none";
    stopTimer();
};

// New game begin
const newGameBegin = () => {
    click.play();
    window.location.reload();
};

// Get hint functionality
const getHint = () => {
    if (hintsUsed >= maxHints) {
        document.getElementById("hintText").innerHTML = "❌ No more hints available!";
        return;
    }
    
    hintsUsed++;
    const diff = Math.abs(computer - (userGuess.length > 0 ? userGuess[userGuess.length - 1] : 50));
    
    let hintText = "";
    if (diff > 30) {
        hintText = "🔥 You're very far! Try a completely different range.";
    } else if (diff > 15) {
        hintText = "🌡️ Getting warmer, but still quite far.";
    } else if (diff > 5) {
        hintText = "🎯 You're close! Keep going!";
    } else if (diff > 0) {
        hintText = "🔥 You're very close! Almost there!";
    }
    
    // Additional hint based on number
    if (computer % 2 === 0) {
        hintText += " The number is EVEN.";
    } else {
        hintText += " The number is ODD.";
    }
    
    document.getElementById("hintText").innerHTML = `💡 Hint ${hintsUsed}/${maxHints}: ${hintText}`;
    click.play();
    
    if (hintsUsed >= maxHints) {
        document.getElementById("hintBtn").disabled = true;
        document.getElementById("hintBtn").style.opacity = "0.5";
    }
};

// Compare guess
const compareGuess = () => {
    const userNumber = Number(userinputnumber.value);
    
    // Validation
    if (!userNumber || userNumber < 1 || userNumber > 100) {
        usernumberUpdate.innerHTML = "⚠️ Please enter a valid number between 1-100!";
        return;
    }
    
    if (userGuess.includes(userNumber)) {
        usernumberUpdate.innerHTML = "🔄 You already guessed this number!";
        userinputnumber.value = "";
        return;
    }
    
    userGuess = [...userGuess, userNumber];
    document.getElementById("guesses").innerHTML = userGuess.join(", ");
    document.getElementById("attempts").innerHTML = `${userGuess.length} / ${maxGuess}`;

    if (userGuess.length < maxGuess) {
        if (userNumber > computer) {
            const diff = userNumber - computer;
            usernumberUpdate.innerHTML = diff > 20 ? "📉 Too High! Much lower!" : "📉 Too High! Try lower.";
            userinputnumber.value = "";
            click.play();
        } else if (userNumber < computer) {
            const diff = computer - userNumber;
            usernumberUpdate.innerHTML = diff > 20 ? "📈 Too Low! Much higher!" : "📈 Too Low! Try higher.";
            userinputnumber.value = "";
            click.play();
        } else {
            const finalTime = stopTimer();
            usernumberUpdate.innerHTML = `🎉 Congratulations! You guessed it in ${userGuess.length} attempts!`;
            userinputnumber.value = "";
            saveBestScore(currentDifficulty, finalTime, userGuess.length);
            startnewgame();
            win.play();
        }
    } else {
        stopTimer();
        if (userNumber === computer) {
            const finalTime = stopTimer();
            usernumberUpdate.innerHTML = `🎉 Congratulations! You guessed it in ${userGuess.length} attempts!`;
            saveBestScore(currentDifficulty, finalTime, userGuess.length);
            win.play();
        } else {
            usernumberUpdate.innerHTML = `😢 Game Over! The correct number was ${computer}`;
            lose.play();
        }
        userinputnumber.value = "";
        startnewgame();
    }
};

// Difficulty modes
const easyMode = () => {
    maxGuess = 10;
    currentDifficulty = 'easy';
    startGame();
};

const mediumMode = () => {
    maxGuess = 7;
    currentDifficulty = 'medium';
    startGame();
};

const hardMode = () => {
    maxGuess = 5;
    currentDifficulty = 'hard';
    startGame();
};

// Leaderboard functions
const showLeaderboard = () => {
    document.getElementById("leaderboardModal").style.display = "flex";
    showLeaderboardTab('easy');
    click.play();
};

const closeLeaderboard = () => {
    document.getElementById("leaderboardModal").style.display = "none";
    click.play();
};

const showLeaderboardTab = (difficulty) => {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${difficulty}Tab`).classList.add('active');
    
    // Get leaderboard data
    const leaderboard = getLeaderboard();
    const scores = leaderboard[difficulty] || [];
    
    let html = '';
    if (scores.length === 0) {
        html = '<p class="no-scores">No scores yet for this difficulty!</p>';
    } else {
        html = '<div class="leaderboard-list">';
        scores.forEach((entry, index) => {
            const minutes = Math.floor(entry.time / 60);
            const seconds = entry.time % 60;
            const date = new Date(entry.date).toLocaleDateString();
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            
            html += `
                <div class="leaderboard-entry">
                    <span class="rank">${medal}</span>
                    <span class="score-info">
                        <strong>${entry.attempts} attempts</strong> in ${minutes}:${String(seconds).padStart(2, '0')}
                    </span>
                    <span class="date">${date}</span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    document.getElementById('leaderboardContent').innerHTML = html;
};

const clearLeaderboard = () => {
    if (confirm('Are you sure you want to clear the entire leaderboard? This cannot be undone.')) {
        localStorage.removeItem('leaderboard');
        showLeaderboardTab('easy');
        click.play();
    }
};

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("leaderboardModal");
    if (event.target === modal) {
        closeLeaderboard();
    }
};

// Add keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modal = document.getElementById("leaderboardModal");
        if (modal.style.display === "flex") {
            closeLeaderboard();
        }
    }
});
