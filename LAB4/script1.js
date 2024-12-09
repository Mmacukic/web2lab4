// Select the canvas and set up the context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const paddleWidth = 150;
const paddleHeight = 20;
const ballRadius = 10;
const brickRowCount = 3;
const brickWidth = 100;
const brickHeight = 30;
const brickPadding = 7;
const brickOffsetTop = 50;
const brickOffsetLeft = 30;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Calculate number of columns dynamically based on canvas width
const brickColumnCount = Math.floor(canvas.width / (brickWidth + brickPadding));

// Paddle object
const paddle = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: canvas.height - paddleHeight - 10,
    width: paddleWidth,
    height: paddleHeight,
    dx: 8.5,
    moveLeft: false,
    moveRight: false,
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height - paddleHeight - 20,
    dx: 2 * (Math.random() < 0.5 ? 1 : -1),
    dy: -5,
    radius: ballRadius,
};

// Bricks array
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, visible: true };
    }
}

// Draw paddle
function drawPaddle() {
    ctx.fillStyle = 'red';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

// Draw bricks
function drawBricks() {
    bricks.forEach((column, c) => {
        column.forEach((brick, r) => {
            if (brick.visible) {
                const x = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const y = r * (brickHeight + brickPadding) + brickOffsetTop;
                brick.x = x;
                brick.y = y;
                ctx.fillStyle = '#00ff00';
                ctx.shadowColor = '#333';
                ctx.shadowBlur = 5;
                ctx.fillRect(x, y, brickWidth, brickHeight);
            }
        });
    });
}

// Draw score and high score
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, canvas.width - 150, 30);
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 300, 30);
}

// Update paddle position
function updatePaddle() {
    if (paddle.moveLeft && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
    if (paddle.moveRight && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.dx;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;x1S
    }

    // Ball collision with paddle
    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy *= -1;
    }

    // Ball collision with bricks
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + brickWidth &&
                    ball.y > brick.y &&
                    ball.y < brick.y + brickHeight
                ) {
                    ball.dy *= -1;
                    brick.visible = false;
                    score++;

                    // Update high score
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('highScore', highScore);
                    }
                }
            }
        });
    });

    // Ball falls below the screen
    if (ball.y - ball.radius > canvas.height) {
        showGameOver('GAME OVER');
    }
}

// Check if all bricks are broken
function checkWin() {
    if (bricks.every(column => column.every(brick => !brick.visible))) {
        showGameOver('YOU WIN!');
    }
}

// Show game over text
function showGameOver(message) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '50px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    document.location.reload();
}

// Handle keydown events
function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') {
        paddle.moveLeft = true;
    } else if (e.key === 'ArrowRight') {
        paddle.moveRight = true;
    }
}

// Handle keyup events
function handleKeyUp(e) {
    if (e.key === 'ArrowLeft') {
        paddle.moveLeft = false;
    } else if (e.key === 'ArrowRight') {
        paddle.moveRight = false;
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle();
    drawBall();
    drawBricks();
    drawScore();

    updatePaddle();
    updateBall();
    checkWin();

    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Start the game
gameLoop();