const {
  addScore,
  changeDirection,
  createFood,
  createInitialState,
  getGameOverReason,
  isSamePosition,
  moveSnake,
} = globalThis.SnakeGameLogic;

const BOARD_SIZE = 20;
const CELL_SIZE = 20;
const MOVE_INTERVAL = 220;

const board = document.querySelector('#game-board');
const context = board.getContext('2d');
const scoreElement = document.querySelector('#score');
const startButton = document.querySelector('#start-button');
const status = document.querySelector('#status');
const gameOverDialog = document.querySelector('#game-over-dialog');
const gameOverReason = document.querySelector('#game-over-reason');
const finalScore = document.querySelector('#final-score');
const restartButton = document.querySelector('#restart-button');

let gameState = createInitialState();
let food = createFood(gameState.snake);
let gameTimer = null;

function drawGrid() {
  context.strokeStyle = '#123b32';
  context.lineWidth = 1;

  for (let index = 0; index <= BOARD_SIZE; index += 1) {
    const position = index * CELL_SIZE;
    context.beginPath();
    context.moveTo(position, 0);
    context.lineTo(position, board.height);
    context.stroke();
    context.beginPath();
    context.moveTo(0, position);
    context.lineTo(board.width, position);
    context.stroke();
  }
}

function drawSnake() {
  gameState.snake.forEach((segment, index) => {
    context.fillStyle = index === 0 ? '#bbf7d0' : '#4ade80';
    context.fillRect(
      segment.x * CELL_SIZE + 2,
      segment.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4,
    );
  });
}

function drawFood() {
  context.fillStyle = '#fb7185';
  context.beginPath();
  context.arc(
    food.x * CELL_SIZE + CELL_SIZE / 2,
    food.y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 3,
    0,
    Math.PI * 2,
  );
  context.fill();
}

function drawGame() {
  context.clearRect(0, 0, board.width, board.height);
  drawGrid();
  drawFood();
  drawSnake();
}

function endGame(reason) {
  window.clearInterval(gameTimer);
  gameTimer = null;
  status.textContent = `游戏结束：${reason}`;
  gameOverReason.textContent = reason;
  finalScore.textContent = gameState.score;
  gameOverDialog.hidden = false;
  startButton.disabled = false;
  restartButton.focus();
}

function advanceGame() {
  const movedState = moveSnake(gameState);
  const gameOverReason = getGameOverReason(movedState.snake);

  if (gameOverReason) {
    endGame(gameOverReason);
    return;
  }

  const ateFood = isSamePosition(movedState.snake[0], food);
  gameState = ateFood ? moveSnake(gameState, true) : movedState;

  if (ateFood) {
    gameState = addScore(gameState);
    food = createFood(gameState.snake);
    scoreElement.textContent = gameState.score;
    status.textContent = `吃到食物！当前分数：${gameState.score}`;
  }

  drawGame();
}

function startGame() {
  window.clearInterval(gameTimer);
  gameState = createInitialState();
  food = createFood(gameState.snake);
  scoreElement.textContent = gameState.score;
  status.textContent = '游戏进行中：请使用方向键控制小蛇。';
  startButton.disabled = true;
  gameOverDialog.hidden = true;
  drawGame();
  gameTimer = window.setInterval(advanceGame, MOVE_INTERVAL);
}

window.addEventListener('keydown', (event) => {
  if (!event.key.startsWith('Arrow')) {
    return;
  }

  event.preventDefault();
  gameState = changeDirection(gameState, event.key);
  drawGame();
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
drawGame();
