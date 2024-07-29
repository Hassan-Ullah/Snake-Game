const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gridSize = 20;
let snake = [{ x: 100, y: 100 }];
let food = { x: 200, y: 200 };
let dx = gridSize;
let dy = 0;
let score = 0;
let gameInterval;

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) generateFood();
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
}

function checkCollision() {
    for (let i = 4; i < snake.length; i++) {
        const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (hasCollided) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    if (checkCollision()) {
        alert('Game Over');
        clearInterval(gameInterval);
        return;
    }

    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
}

function restartGame() {
    snake = [{ x: 100, y: 100 }];
    dx = gridSize;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

document.addEventListener('keydown', changeDirection);
restartGame();
