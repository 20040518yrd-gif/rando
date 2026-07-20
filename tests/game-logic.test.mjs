import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);

function loadGameLogic() {
  return require('../game-logic.js');
}

test('初始状态包含一条向右移动的三格蛇', async () => {
  const gameLogic = await loadGameLogic();

  assert.deepEqual(gameLogic.createInitialState?.(), {
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    direction: { x: 1, y: 0 },
    score: 0,
  });
});

test('蛇会按当前方向向右移动一格', async () => {
  const gameLogic = await loadGameLogic();
  const state = {
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    direction: { x: 1, y: 0 },
    score: 0,
  };

  assert.deepEqual(gameLogic.moveSnake?.(state), {
    snake: [
      { x: 11, y: 10 },
      { x: 10, y: 10 },
      { x: 9, y: 10 },
    ],
    direction: { x: 1, y: 0 },
    score: 0,
  });
});

test('方向键可以把蛇的方向改为向下', async () => {
  const gameLogic = await loadGameLogic();
  const state = {
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    direction: { x: 1, y: 0 },
    score: 0,
  };

  assert.deepEqual(gameLogic.changeDirection?.(state, 'ArrowDown'), {
    snake: state.snake,
    direction: { x: 0, y: 1 },
    score: 0,
  });
});

test('食物不会生成在蛇身上', async () => {
  const gameLogic = await loadGameLogic();
  const randomValues = [0.5, 0.5, 0.2, 0.3];
  let randomIndex = 0;
  const random = () => randomValues[randomIndex++];

  const food = gameLogic.createFood?.([{ x: 10, y: 10 }], random);

  assert.deepEqual(food, { x: 4, y: 6 });
});

test('蛇吃到食物时会增长一格并让分数加一', async () => {
  const gameLogic = await loadGameLogic();
  const state = {
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    direction: { x: 1, y: 0 },
    score: 0,
  };

  const longerState = gameLogic.moveSnake?.(state, true);
  const scoredState = gameLogic.addScore?.(longerState);

  assert.deepEqual(scoredState, {
    snake: [
      { x: 11, y: 10 },
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    direction: { x: 1, y: 0 },
    score: 1,
  });
});

test('蛇头撞到边界时会给出撞墙结束原因', async () => {
  const gameLogic = await loadGameLogic();

  assert.equal(
    gameLogic.getGameOverReason?.([
      { x: 20, y: 10 },
      { x: 19, y: 10 },
      { x: 18, y: 10 },
    ]),
    '撞到墙壁',
  );
});

test('蛇头碰到自己的身体时会给出自撞结束原因', async () => {
  const gameLogic = await loadGameLogic();

  assert.equal(
    gameLogic.getGameOverReason?.([
      { x: 8, y: 8 },
      { x: 8, y: 7 },
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 8 },
    ]),
    '撞到自己',
  );
});
