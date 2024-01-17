const playBroad = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const higScoreElement = document.querySelector(".high-score");

const hScore = localStorage.getItem("highest-score");

if (hScore) higScoreElement.innerText = `Highest Score : ${hScore}`;

let foodX, foodY;
let snakeX = 5, snakeY = 5;

let velocityX = 0, // -1, 0, 1
  velocityY = 0; // -1, 0, 1

let snakeBody = []; // [{5,5}, {6,5}, {7,5}, {8,5}]

let score = 0, highestScore = 0;

let gameOver = false;

let intervalId;

const updateFruitPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const changeDirection = (event) => {
//   console.log(velocityX, " : ", velocityY, " : ", event.key);
  if (event.key === "ArrowUp" && velocityY != 1) {
    // up key
    velocityY = -1;
    velocityX = 0;
  } else if (event.key === "ArrowDown" && velocityY != -1) {
    // down key
    velocityY = 1;
    velocityX = 0;
  } else if (event.key === "ArrowLeft" && velocityX != 1) {
    // left key
    velocityX = -1;
    velocityY = 0;
  } else if (event.key === "ArrowRight" && velocityX != -1) {
    // right key
    velocityX = 1;
    velocityY = 0;
    console.log("ArrowRight!");
  }
};

function handleGameOver() {
  clearInterval(intervalId);
  alert("Game Over! Press ok to replay.");
}

function initGame() {
  if (gameOver) return handleGameOver();
  // 1) define the position of the food/fruit
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  // 2) check if the snake has hit the fruit
  if (snakeX == foodX && snakeY == foodY) {
    // pushing the fruit in the snakeBody
    snakeBody.push({ foodX, foodY });
    score++;
    highestScore = score >= highestScore ? score : highestScore;
    localStorage.setItem("highest-score", highestScore);
    scoreElement.innerText = `Score : ${score}`;
    higScoreElement.innerText = `Highest Score : ${highestScore}`;
    updateFruitPosition();
  }

  // 3) increse the position of the snake
  snakeX += velocityX; // 2    // 1
  snakeY += velocityY; // 2    // 0

  // 4) move the position of the snake logically.
  // shifting forward the values of the elements in the snake body by one
  for (let i = snakeBody.length - 1; i > 0; i--)
    snakeBody[i] = snakeBody[i - 1];
  // updatating the head on the 0th index
  snakeBody[0] = [snakeX, snakeY];

  // 5) check if the snake is hiting the wall
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30)
    return (gameOver = true);
  // 6) finially move the snake in the ui
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // 7) make sure the snake does not hit its own body

    if (i != 0 && snakeBody[0][1] == snakeBody[i][1] && snakeBody[0][0] == snakeBody[i][0]) {
      // collision
      gameOver = true;
    }
  }

  playBroad.innerHTML = html;
}

updateFruitPosition();

// [{5,5}, {6,5}, {7,5}, {8,5}] ====>

// [{6,5}, {7,5}, {8,5}, {9,5}] // right movement

// [{6,5}, {7,5}, {8,5}, {8,6}] // down movement

// [{6,5}, {7,5}, {8,5}, {8, 4}]    // up movement

intervalId = setInterval(initGame, 200);
document.addEventListener("keyup", changeDirection);