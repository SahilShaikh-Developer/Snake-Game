const board = document.querySelector(".board");

const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight = 30;
const blockWidth = 30;

let highScore = Number(localStorage.getItem("highScore")) || 0;
let score = 0;
let time = "00:00";

highScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerIntervalId = null;

const blocks = [];
let snake = [{ x: 1, y: 3 }];
let direction = "down";

let food = getRandomFood();

// Build grid
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

function getRandomFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

function render() {
  let head;

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  // Wall collision
  if (
    head.x < 0 ||
    head.x >= rows ||
    head.y < 0 ||
    head.y >= cols
  ) {
    gameOver();
    return;
  }

  // Self collision
  if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
    gameOver();
    return;
  }

  // Food logic
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = getRandomFood();

    score += 10;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
      highScoreElement.innerText = highScore;
    }
  } else {
    const tail = snake.pop();
    blocks[`${tail.x}-${tail.y}`].classList.remove("fill");
  }

  snake.unshift(head);
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

function gameOver() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  modal.style.display = "flex";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "flex";
}

startButton.addEventListener("click", () => {
  modal.style.display = "none";

  intervalId = setInterval(render, 300);

  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);

    if (sec === 59) {
      min++;
      sec = 0;
    } else {
      sec++;
    }

    time = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    timeElement.innerText = time;
  }, 1000);
});

restartButton.addEventListener("click", restartGame);

function restartGame() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  score = 0;
  time = "00:00";
  direction = "down";
  snake = [{ x: 1, y: 3 }];
  food = getRandomFood();

  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore;

  modal.style.display = "none";

  intervalId = setInterval(render, 300);

  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);

    if (sec === 59) {
      min++;
      sec = 0;
    } else {
      sec++;
    }

    time = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    timeElement.innerText = time;
  }, 1000);
}

// Controls
addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (event.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  } else if (event.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (event.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  }
});
