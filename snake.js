// Game configuration constants
const GRID_SIZE = 20;      // Size of each grid cell in pixels
const GAME_SPEED = 100;    // Game update interval in milliseconds

// Initialize canvas and score elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Initialize game state variables
let snake = [
    {x: 200, y: 200},  // Head of the snake
    {x: 180, y: 200},  // Body segment
    {x: 160, y: 200},  // Tail segment
];

// 1. Define obstacles (example: 3 obstacles)
const obstacles = [
    {x: 100, y: 100},
    {x: 200, y: 300},
    {x: 300, y: 100}
];

let direction = 'right';   // Initial movement direction
let food = generateFood(); // Generate first food position
let score = 0;            // Initialize score
let gameLoop;             // Store game loop interval ID

// (Optional) Prevent food from spawning on obstacles or snake
function generateFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE,
            y: Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE
        };
        // Ensure food does not spawn on snake or obstacles
        const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        const onObstacle = obstacles.some(obs => obs.x === newFood.x && obs.y === newFood.y);
        if (!onSnake && !onObstacle) break;
    }
    return newFood;
}

/**
 * Renders the game state on the canvas
 */
function drawGame() {
    // Clear the entire canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw obstacles
    ctx.fillStyle = '#888';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw each segment of the snake
    ctx.fillStyle = '#0f0';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw the food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x, food.y, GRID_SIZE - 2, GRID_SIZE - 2);
}

/**
 * Updates snake position and handles eating food
 */
function moveSnake() {
    // Create new head based on current direction
    const head = {...snake[0]};

    // Update head position based on current direction
    switch(direction) {
        case 'up': head.y -= GRID_SIZE; break;
        case 'down': head.y += GRID_SIZE; break;
        case 'left': head.x -= GRID_SIZE; break;
        case 'right': head.x += GRID_SIZE; break;
    }

    // Check for collisions with walls or self
    if (isCollision(head)) {
        gameOver();
        return;
    }

    // Add new head to beginning of snake array
    snake.unshift(head);

    // Handle food collision
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();    // Generate new food
        score += 10;              // Increment score
        scoreElement.textContent = score;
    } else {
        snake.pop();             // Remove tail if no food eaten
    }
}

/**
 * Checks if the given position collides with walls, snake body, or obstacles
 * @param {Object} position - Position to check for collision
 * @returns {boolean} True if collision detected
 */
function isCollision(position) {
    // Check for wall collisions
    if (position.x < 0 || position.x >= canvas.width ||
        position.y < 0 || position.y >= canvas.height) {
        return true;
    }

    // Check for collision with snake body
    if (snake.some(segment => 
        segment.x === position.x && segment.y === position.y
    )) {
        return true;
    }

    // Check for collision with obstacles
    if (obstacles.some(obs =>
        obs.x === position.x && obs.y === position.y
    )) {
        return true;
    }

    return false;
}

/**
 * Handles game over state
 */
function gameOver() {
    clearInterval(gameLoop);      // Stop game loop
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over!', 80, 200);
}

// Event listener for keyboard controls
document.addEventListener('keydown', (event) => {
    // Update direction based on arrow key press
    // Prevent snake from reversing directly into itself
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Initialize game loop
gameLoop = setInterval(() => {
    moveSnake();
    drawGame();
}, GAME_SPEED);