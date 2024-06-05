// Setting up the canvas and context
let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');

// Initialize game state and related variables
let score = 0;
let time = 180;
let gameInterval;
let timerInterval;
let gameRunning = false;
let gamePaused = false;
let mainSoundOn = false;
let videoBackground = document.getElementById('videoBackground');

// Reference to sound elements
let mainSound = document.getElementById('mainSound');
let initialEffect = document.getElementById('initialEffect');
let gameStartEffect = document.getElementById('gameStartEffect');
let gameOverEffect = document.getElementById('gameOverEffect');
let catchWormEffect = document.getElementById('catchWormEffect');
let missWormEffect = document.getElementById('missWormEffect');
let toggleEffect = document.getElementById('toggleEffect');

// Reference to settings toggle buttons
let mainSoundToggle = document.getElementById('mainSoundToggle');
let effectSoundToggle = document.getElementById('effectSoundToggle');
let gameTimeToggle = document.getElementById('gameTimeToggle');

// Worm-related variables
let worms = [];
let wormTimers = [];
const wormLifeCycle = 600;  // Duration of each life stage (in frames)
const wormInitialRadius = 10;
const wormStageChangeInterval = 120; // Interval for worm size and color change (in frames)
const maxWorms = 4;
let wormColorToggle = false;
setInterval(() => {
    wormColorToggle = !wormColorToggle;
}, 300); // Toggle color every 0.3 seconds

// Character image setup
let characterImages = {
    stand: new Image(),
    rightRun: [],
    leftRun: [],
    rightAttack: [],
    leftAttack: []
};

// Initial character setup
let character = {
    x: 0,
    y: 0,
    scaleWidth: 0,
    scaleHeight: 0,
    width: 30,
    height: 30,
    speed: 1.5,
    direction: 'stand',
    frameIndex: 0,
    frameCount: 0,
    frameInterval: 5,
    image: characterImages.stand
};

// Load the character's default standing image
characterImages.stand.src = 'Resources/images/character-sprite-origin.png';
characterImages.stand.onload = function () {
    initializeCharacter();
    console.log('Character stand image loaded successfully');
};

characterImages.stand.onerror = function () {
    console.error('Failed to load character stand image');
};

// Function to initialize character settings
function initializeCharacter() {
    const scale = 0.08; // Scaling factor for the character size
    character.width = characterImages.stand.naturalWidth * scale;
    character.height = characterImages.stand.naturalHeight * scale;
    character.x = (canvas.width - character.width) / 2;
    character.y = (canvas.height * 1 / 3) - (character.height / 2);
    console.log(`Character initialized at position: (${character.x}, ${character.y}) with size: (${character.width}x${character.height})`);
    console.log(`Character naturalWidth and naturalHeight: (${characterImages.stand.naturalWidth}, ${characterImages.stand.naturalHeight})`);
}

// Function to load character animation images
function loadCharacterImages() {
    for (let i = 0; i <= 11; i++) {
        let rightRunImg = new Image();
        rightRunImg.src = `Resources/images/Right-run-origin/Right-run-${String(i).padStart(3, '0')}.png`;
        rightRunImg.onload = function () {
            console.log(`Right run image ${i} loaded successfully`);
        };
        rightRunImg.onerror = function () {
            console.error(`Failed to load right run image ${i}`);
        };
        characterImages.rightRun.push(rightRunImg);

        let leftRunImg = new Image();
        leftRunImg.src = `Resources/images/Left-run-origin/Left-run-${String(i).padStart(3, '0')}.png`;
        leftRunImg.onload = function () {
            console.log(`Left run image ${i} loaded successfully`);
        };
        leftRunImg.onerror = function () {
            console.error(`Failed to load left run image ${i}`);
        };
        characterImages.leftRun.push(leftRunImg);

        let rightAttackImg = new Image();
        rightAttackImg.src = `Resources/images/Right-attack-origin/Right-attack-${String(i).padStart(3, '0')}.png`;
        rightAttackImg.onload = function () {
            console.log(`Right attack image ${i} loaded successfully`);
        };
        rightAttackImg.onerror = function () {
            console.error(`Failed to load right attack image ${i}`);
        };
        characterImages.rightAttack.push(rightAttackImg);

        let leftAttackImg = new Image();
        leftAttackImg.src = `Resources/images/Left-attack-origin/Left-attack-${String(i).padStart(3, '0')}.png`;
        leftAttackImg.onload = function () {
            console.log(`Left attack image ${i} loaded successfully`);
        };
        leftAttackImg.onerror = function () {
            console.error(`Failed to load left attack image ${i}`);
        };
        characterImages.leftAttack.push(leftAttackImg);
    }
}

// Initialize and load character images
loadCharacterImages();

// Function to create a new worm
function createWorm() {
    if (worms.length >= maxWorms) return null;
    let worm = {
        x: Math.random() * canvas.width,
        y: canvas.height * (2 / 3) + Math.random() * (canvas.height / 3),
        radius: wormInitialRadius,
        lifeStage: 1,
        lifeCycleCounter: 0,
        direction: Math.random() * 2 * Math.PI,
        speed: Math.random() / 4,
        color: 'peachpuff',
        originalColor: 'peachpuff',
        colorToggle: false
    };
    console.log("Created worm at (" + worm.x + ", " + worm.y + ")");
    return worm;
}

// Function to generate worms periodically
function generateWorm() {
    if (worms.length < maxWorms) {
        let newWorm = createWorm();
        if (newWorm) worms.push(newWorm);
        console.log("Worm generated, current count: " + worms.length);
    }

    let nextWormTime = Math.random() * 4000 + 1000;
    console.log("Next worm generation in: " + nextWormTime + "ms");

    let timer = setTimeout(generateWorm, nextWormTime);
    wormTimers.push(timer);
}

// Clear all worm timers
function clearWormTimers() {
    wormTimers.forEach(timer => clearTimeout(timer));
    wormTimers = [];
}

// Function to start the game
function startGame() {
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('pauseGame').classList.add('hidden');
    document.getElementById('score').textContent = score;
    time = document.getElementById('gameTimeToggle').checked ? 60 : 180; // Game time selection logic
    document.getElementById('time').textContent = time;
    gameRunning = true;
    worms = []; // Initialize worms
    generateWorms(); // Start worm generation
    gameInterval = setInterval(updateGame, 1000 / 60);
    startTimer();
    document.getElementById('gameTimeToggle').disabled = true; // Disable game time toggle during the game
    if (effectSoundToggle.checked && gameStartEffect) {
        gameStartEffect.play();
        if (mainSoundOn && mainSound) {
            setTimeout(() => {
                mainSound.play();
            }, 4000);
        }
    } else if (mainSoundOn && mainSound) {
        mainSound.play();
    }
}

// Function to restart the game
function restartGame() {
    if (effectSoundToggle.checked && initialEffect) {
        initialEffect.play();
    }

    clearInterval(gameInterval);
    clearInterval(timerInterval); // Reset timer
    gameRunning = false;
    score = 0;
    time = document.getElementById('gameTimeToggle').checked ? 60 : 180; // Game time selection logic
    worms = []; // Initialize worms
    character.x = canvas.width / 2;
    character.y = canvas.height * (1 / 3);
    document.getElementById('instructions').classList.remove('hidden');
    let startButton = document.getElementById('startButton');
    startButton.innerText = 'Restart Game';
    startButton.classList.remove('hidden');
    startButton.classList.add('restart-button');
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('pauseGame').classList.add('hidden');
}

// Generate worms up to the maximum limit
function generateWorms() {
    console.log("Starting worm generation...");
    while (worms.length < maxWorms) {
        let newWorm = createWorm();
        if (newWorm) {
            worms.push(newWorm);
            console.log(`Created worm at (${newWorm.x}, ${newWorm.y})`);
        }
    }
}

// Update the game state
function updateGame() {
    if (!gameRunning) return;
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    updateCharacter();
    updateWorms();
    drawCharacter();
    drawWorms();
    checkCollisions();
}

// Update character state
function updateCharacter() {
    let isMoving = false;

    if (keys['ArrowUp'] || keys['w']) {
        character.y -= character.speed;
        isMoving = true;
    }
    if (keys['ArrowDown'] || keys['s']) {
        character.y += character.speed;
        isMoving = true;
    }
    if (keys['ArrowLeft'] || keys['a']) {
        character.x -= character.speed;
        character.direction = 'leftRun';
        isMoving = true;
    }
    if (keys['ArrowRight'] || keys['d']) {
        character.x += character.speed;
        character.direction = 'rightRun';
        isMoving = true;
    }
    if (keys[' ']) {
        character.direction = character.direction.includes('left') ? 'leftAttack' : 'rightAttack';
        isMoving = true;
    }

    if (!isMoving) {
        character.direction = 'stand';
    }

    character.frameCount++;
    if (character.frameCount >= character.frameInterval) {
        character.frameCount = 0;
        character.frameIndex = (character.frameIndex + 1) % 12;
    }

    character.x = Math.max(0, Math.min(canvas.width - character.width, character.x));
    character.y = Math.max(canvas.height * (1 / 3), Math.min(canvas.height - character.height + 10, character.y));
}

// Draw the character on the canvas
function drawCharacter() {
    let image;
    if (character.direction === 'stand') {
        image = characterImages.stand;
    } else {
        image = characterImages[character.direction][character.frameIndex];
    }

    if (image.complete && image.naturalHeight !== 0) {  // Ensure the image is fully loaded
        context.drawImage(image, character.x, character.y, character.width, character.height);
    } else {
        console.error('Image is not completely loaded or is broken');
    }
}

// Function to generate worms periodically
function generateWorm() {
    if (worms.length < maxWorms) {
        let newWorm = createWorm();
        if (newWorm) worms.push(newWorm);
    }

    let nextWormTime = Math.random() * 4000 + 1000;
    setTimeout(generateWorm, nextWormTime);
}

// Update worm states
function updateWorms() {
    worms.forEach((worm, index) => {
        worm.lifeCycleCounter++;

        // Define behavior for each life stage
        if (worm.lifeStage === 1) {
            worm.color = 'peachpuff';
        } else if (worm.lifeStage === 2) {
            if (worm.lifeCycleCounter % wormStageChangeInterval === 0) {
                worm.radius += wormInitialRadius / 5;
                worm.color = `rgb(${255 - (worm.lifeCycleCounter / 5)}, 218, 185)`;
                worm.speed /= 2;
            }
        } else if (worm.lifeStage === 3) {
            if (worm.lifeCycleCounter % wormStageChangeInterval === 0) {
                worm.radius -= wormInitialRadius / 5;
                worm.color = worm.colorToggle ? 'red' : worm.originalColor;
                worm.originalColor = `rgb(${Math.min(255, 255 - worm.lifeCycleCounter / 5)}, 218, 185)`;
                worm.speed /= 2;
            }
            if (worm.lifeCycleCounter % 30 === 0) {
                worm.colorToggle = !worm.colorToggle;
            }
        }

        if (worm.lifeCycleCounter > wormLifeCycle) {
            worm.lifeStage++;
            worm.lifeCycleCounter = 0;

            if (worm.lifeStage > 3) {
                if (effectSoundToggle.checked) {
                    missWormEffect.play();
                }
                worms.splice(index, 1); // Remove worm
            }
        }

        worm.x += worm.speed * Math.cos(worm.direction);
        worm.y += worm.speed * Math.sin(worm.direction);
        if (worm.x < 0 || worm.x > canvas.width || worm.y < canvas.height * (2 / 3) || worm.y > canvas.height) {
            worm.direction = (worm.direction + Math.PI) % (2 * Math.PI);
        }
    });

    while (worms.length < maxWorms) {
        let newWorm = createWorm();
        if (newWorm) worms.push(newWorm);
    }
}

// Draw worms on the canvas
function drawWorms() {
    worms.forEach(worm => {
        context.save();
        context.shadowColor = 'rgba(0, 0, 0, 0.8)';
        context.shadowBlur = 20;
        context.shadowOffsetX = 5;
        context.shadowOffsetY = 5;

        if (worm.lifeStage === 1) {
            context.beginPath();
            context.ellipse(worm.x, worm.y, worm.radius, worm.radius / 2, 0, 0, Math.PI, true); // Small ellipse
            context.fillStyle = 'peachpuff';
            context.fill();
            context.strokeStyle = 'gray'; // Darker border color
            context.lineWidth = 0.2;
            context.stroke();
        } else if (worm.lifeStage === 2) {
            context.beginPath();
            context.ellipse(worm.x, worm.y, worm.radius, worm.radius, 0, 0, Math.PI, true); // Large ellipse path
            context.lineWidth = 0.5;
            context.strokeStyle = 'black'; // Border color
            context.stroke(); // Draw large ellipse border

            context.beginPath();
            context.ellipse(worm.x, worm.y, worm.radius, worm.radius / 2, 0, 0, Math.PI, true); // Add small ellipse path
            context.fillStyle = 'peachpuff';
            context.fill();
            context.strokeStyle = 'gray'; // Border color for small ellipse
            context.stroke(); // Draw small ellipse border

            context.beginPath();
            context.ellipse(worm.x, worm.y, worm.radius, worm.radius, 0, 0, Math.PI, true); // Large ellipse path
            context.ellipse(worm.x, worm.y, worm.radius, worm.radius / 2, 0, 0, Math.PI, true); // Small ellipse path
            context.fillStyle = 'rgba(236, 198, 119, 1)'; // Fill color
            context.fill('evenodd'); // Fill the area between ellipses
        } else if (worm.lifeStage === 3) {
            context.beginPath();
            context.ellipse(worm.x, worm.y, worm.radius, worm.radius / 2, 0, 0, Math.PI, true); // Semi-ellipse
            if (wormColorToggle) {
                context.fillStyle = 'rgba(236, 198, 119, 1)'; // First color
            } else {
                context.fillStyle = 'rgba(248, 138, 55 , 1)'; // Second color
            }
            context.fill();
            context.strokeStyle = 'gray'; // Border color
            context.lineWidth = 0.2;
            context.stroke();
        }

        context.restore();
    });
}

// Check for collisions between character and worms
function checkCollisions() {
    worms.forEach((worm, index) => {
        let dx = character.x + character.width / 2 - worm.x;
        let dy = character.y + character.height / 2 - worm.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < character.width / 2 + worm.radius && keys[' ']) {
            if (effectSoundToggle.checked) {
                catchWormEffect.play();
            }
            score++;
            document.getElementById('score').textContent = score;
            worms.splice(index, 1); // Remove worm
        }
    });
}

// Update the game timer
function updateTime() {
    if (!gameRunning) return;
    time--;
    document.getElementById('time').textContent = time;
    if (time <= 0) {
        clearInterval(gameInterval);
        gameOver();
    }
}

// Start the game timer
function startTimer() {
    timerInterval = setInterval(function () {
        if (!gameRunning) {
            clearInterval(timerInterval);
            return;
        }
        time--;
        document.getElementById('time').textContent = time;
        if (time <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

// Handle game over state
function gameOver() {
    clearWormTimers();
    if (effectSoundToggle.checked && gameOverEffect) {
        gameOverEffect.play();
    }
    if (mainSoundOn && mainSound) {
        mainSound.pause();
    }

    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('pauseGame').classList.add('hidden');
    document.getElementById('gameTimeToggle').disabled = false; // Enable game time toggle after game over
}

// Pause the game
function pauseGame() {
    if (mainSoundOn) mainSound.pause();
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameRunning = false;
    gamePaused = true;
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('pauseGame').classList.remove('hidden');
    videoBackground.pause();
}

// Resume the game
function resumeGame() {
    if (mainSoundOn) mainSound.play();

    gameRunning = true;
    gamePaused = false;
    gameInterval = setInterval(updateGame, 1000 / 60);
    document.getElementById('pauseGame').classList.add('hidden');
    timerInterval = setInterval(function () {
        if (!gameRunning) {
            clearInterval(timerInterval);
            return;
        }
        time--;
        document.getElementById('time').textContent = time;
        if (time <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
    videoBackground.play();
}

// Handle keyboard inputs
let keys = {};
window.addEventListener('keydown', function (e) {
    keys[e.key] = true;
    if (e.key === ' ' && gameRunning) {
        checkCollisions();
    }
    if (e.key === 'Enter') {
        if (!gameRunning && document.getElementById('gameOver').classList.contains('hidden')) {
            startGame();
        } else if (!gameRunning && !document.getElementById('gameOver').classList.contains('hidden')) {
            restartGame();
        }
    }
    if (e.key === 'End') {
        gameOver();
    }
    if (e.key === 'Escape') {
        if (gamePaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
});

window.addEventListener('keyup', function (e) {
    keys[e.key] = false;
});

// Initialize elements on DOM content load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sound elements
    mainSound = document.getElementById('mainSound');
    initialEffect = document.getElementById('initialEffect');
    gameStartEffect = document.getElementById('gameStartEffect');
    gameOverEffect = document.getElementById('gameOverEffect');
    catchWormEffect = document.getElementById('catchWormEffect');
    missWormEffect = document.getElementById('missWormEffect');
    toggleEffect = document.getElementById('toggleEffect');

    // Null check
    if (!mainSound || !initialEffect || !gameStartEffect || !gameOverEffect || !catchWormEffect || !missWormEffect || !toggleEffect) {
        console.error('One or more audio elements are not found.');
    }

    characterImages.stand.src = 'Resources/images/character-sprite-origin.png';

    characterImages.stand.onload = function () {
        initializeCharacter();
    };

    characterImages.stand.onerror = function () {
        console.error(`Failed to load the image from: ${characterImages.stand.src}`);
    };

    if (characterImages.stand.complete) {
        initializeCharacter();
    }

    let startButton = document.getElementById('startButton');
    startButton.innerText = 'Start Game';
    startButton.classList.remove('restart-button');
    startButton.classList.remove('hidden');
    document.getElementById('instructions').classList.remove('hidden');
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('pauseGame').classList.add('hidden');
    clearInterval(gameInterval);
    score = 0;
    time = document.getElementById('gameTimeToggle').checked ? 10 : 5;
    worms = [];
    for (let i = 0; i < maxWorms; i++) {
        let newWorm = createWorm();
        if (newWorm) worms.push(newWorm);
    }
    character.x = canvas.width / 2;
    character.y = canvas.height * (1 / 3);
});

// Handle sound settings toggle
mainSoundToggle.addEventListener('change', function () {
    toggleEffect.play();
    if (this.checked) {
        mainSoundOn = true;
        if (gameRunning) mainSound.play();
    } else {
        mainSoundOn = false;
        mainSound.pause();
    }
});

effectSoundToggle.addEventListener('change', function () {
    toggleEffect.play();
});

gameTimeToggle.addEventListener('change', function () {
    if (this.checked) {
        document.getElementById('time').textContent = '60';
    } else {
        document.getElementById('time').textContent = '180';
    }
    toggleEffect.play();
});

// Console log image load status
characterImages.stand.onload = function () {
    console.log(`Stand Image Size: ${this.naturalWidth}x${this.naturalHeight}`);
};

characterImages.rightRun.forEach((img, index) => {
    img.onload = function () {
        console.log(`Right Run Image ${index} Size: ${this.naturalWidth}x${this.naturalHeight}`);
    };
});

characterImages.leftRun.forEach((img, index) => {
    img.onload = function () {
        console.log(`Left Run Image ${index} Size: ${this.naturalWidth}x${this.naturalHeight}`);
    };
});

characterImages.rightAttack.forEach((img, index) => {
    img.onload = function () {
        console.log(`Right Attack Image ${index} Size: ${this.naturalWidth}x${this.naturalHeight}`);
    };
});

characterImages.leftAttack.forEach((img, index) => {
    img.onload = function () {
        console.log(`Left Attack Image ${index} Size: ${this.naturalWidth}x${this.naturalHeight}`);
    };
});
