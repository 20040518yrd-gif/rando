const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const BOARD_SIZE = 20;

export function createInitialState() {
  return {
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    direction: { x: 1, y: 0 },
    score: 0,
  };
}

export function moveSnake(state, grows = false) {
  const head = state.snake[0];
  const nextHead = {
    x: head.x + state.direction.x,
    y: head.y + state.direction.y,
  };

  return {
    snake: [nextHead, ...state.snake.slice(0, grows ? state.snake.length : -1)],
    direction: { ...state.direction },
    score: state.score,
  };
}

export function isSamePosition(firstPosition, secondPosition) {
  return (
    firstPosition.x === secondPosition.x && firstPosition.y === secondPosition.y
  );
}

export function createFood(snake, random = Math.random) {
  let food;

  do {
    food = {
      x: Math.floor(random() * BOARD_SIZE),
      y: Math.floor(random() * BOARD_SIZE),
    };
  } while (snake.some((segment) => isSamePosition(segment, food)));

  return food;
}

export function addScore(state) {
  return {
    ...state,
    score: state.score + 1,
  };
}

export function getGameOverReason(snake) {
  const [head, ...body] = snake;
  const hitWall =
    head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE;

  if (hitWall) {
    return '撞到墙壁';
  }

  if (body.some((segment) => isSamePosition(segment, head))) {
    return '撞到自己';
  }

  return null;
}

export function changeDirection(state, key) {
  const nextDirection = DIRECTIONS[key];

  if (!nextDirection) {
    return state;
  }

  const isOpposite =
    state.direction.x + nextDirection.x === 0 &&
    state.direction.y + nextDirection.y === 0;

  if (isOpposite) {
    return state;
  }

  return {
    snake: state.snake,
    direction: nextDirection,
    score: state.score,
  };
}
