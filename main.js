import './styles.scss'

(function () {
  /**
   * Game functions
   */
  function start() {
    toggleStartButton()
    snake = generateSnake()
    gameCycle()
  }

  function gameCycle() {
    clearCanvas();
    drawGrid()
    moveSnake()
    drawFood()
    if (checkBorderCollision()) {
      writeGameOverText()
      toggleStartButton()
      return
    }
    setTimeout(() => {
      gameCycle()
    }, getCycleTimeout());
  }

  function getCycleTimeout() {
    return 1000 - difficultyLevel * 10 - 600
  }

  function drawGrid() {
    const gridColor = '#abafa5'
    for (let i = step; i < DIMENSIONS[0]; i += step) {
      ctx.beginPath();
      ctx.moveTo(0, i)
      ctx.lineTo(DIMENSIONS[1], i)
      ctx.strokeStyle = gridColor
      ctx.stroke()
    }
    for (let i = step; i < DIMENSIONS[1]; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0)
      ctx.lineTo(i, DIMENSIONS[1])
      ctx.strokeStyle = gridColor
      ctx.stroke()
    }
  }

  function keysBind(e) {
    if (e.key === 'ArrowUp' && currentDirection !== DIRECTION.DOWN) {
      e.preventDefault()
      changeDirection(DIRECTION.UP)
    } else if (e.key === 'ArrowDown' && currentDirection !== DIRECTION.UP) {
      e.preventDefault()
      changeDirection(DIRECTION.DOWN)
    } else if (e.key === 'ArrowLeft' && currentDirection !== DIRECTION.RIGHT) {
      changeDirection(DIRECTION.LEFT)
    } else if (e.key === 'ArrowRight' && currentDirection !== DIRECTION.RIGHT) {
      changeDirection(DIRECTION.RIGHT)
    }
  }

  function assignControlButtons() {
    const startButton = document.getElementById('start')
    startButton.addEventListener('click', start)
    document.onkeydown = keysBind

    const upButton = document.getElementById('up')
    upButton.addEventListener('click', () => changeDirection(DIRECTION.UP))
    const downButton = document.getElementById('down')
    downButton.addEventListener('click', () => changeDirection(DIRECTION.DOWN))
    const leftButton = document.getElementById('left')
    leftButton.addEventListener('click', () => changeDirection(DIRECTION.LEFT))
    const rightButton = document.getElementById('right')
    rightButton.addEventListener('click', () => changeDirection(DIRECTION.RIGHT))
  }

  function changeDirection(direction) {
    currentDirection = direction
  }

  function clearCanvas() {
    return ctx.clearRect(0, 0, DIMENSIONS[0], DIMENSIONS[1]);
  }

  function toggleStartButton() {
    const startButton = document.getElementById('start');
    startButton.classList.toggle('active');
  }

// snake
  function generateSnake() {
    return [
      {x: DIMENSIONS[0] / 2 - 30, y: DIMENSIONS[1] / 2},
      {x: DIMENSIONS[0] / 2 - 20, y: DIMENSIONS[1] / 2},
      {x: DIMENSIONS[0] / 2 - 10, y: DIMENSIONS[1] / 2},
    ];
  }

  function drawSnake() {
    snake.forEach((circle, index) => {
      ctx.beginPath();
      if (index === snake.length - 1) {
        ctx.fillStyle = "blue";
        ctx.arc(circle.x - 5, circle.y - 5, 7, 0, 2 * Math.PI);
      } else {
        ctx.fillStyle = "darkgreen";
        ctx.arc(circle.x - 5, circle.y - 5, 5, 0, 2 * Math.PI);
      }
      ctx.fill();
    });
  }

  function moveSnake() {
    addHead()
    const isAteFood = ateFood()
    if (!isAteFood) {
      removeTail();
    } else {
      difficultyLevel++
      food = generateFood()
    }
    drawSnake();
  }

  function removeTail() {
    snake.shift();
  }

  function addHead() {
    const headPosition = {...getHeadPosition()} // clone object
    switch (currentDirection) {
      case DIRECTION.RIGHT:
        headPosition.x += 10
        break
      case DIRECTION.LEFT:
        headPosition.x -= 10
        break
      case DIRECTION.UP:
        headPosition.y -= 10
        break
      case DIRECTION.DOWN:
        headPosition.y += 10
        break
      default:
        headPosition.y += 10
    }
    snake.push(headPosition);
  }

  function ateFood() {
    const head = getHeadPosition()
    if (head.x === food.x && head.y === food.y) {
      food = generateFood()
      return true
    } else {
      return false
    }
  }

  function getHeadPosition() {
    return snake[snake.length - 1]
  }

  function checkBorderCollision() {
    const head = getHeadPosition()
    return (
      head.x < 0 ||
      head.x > DIMENSIONS[0] ||
      head.y < 0 ||
      head.y > DIMENSIONS[1]
    )
  }

  function writeGameOverText() {
    clearCanvas()
    ctx.font = `${DIMENSIONS[0] / 2 / 5}px sans-serif`
    ctx.fillText("Game Over", DIMENSIONS[0] / 2 / 2, DIMENSIONS[1] / 2)
  }

// Food
  function generateFood() {
    return {
      x: Math.ceil(Math.random() * (DIMENSIONS[0] / 10 - 1) + 1) * 10,
      y: Math.ceil(Math.random() * (DIMENSIONS[1] / 10 - 1) + 1) * 10
    }
  }

  function drawFood() {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(food.x - 5, food.y - 5, 7, 0, 2 * Math.PI);
    ctx.arc(food.x - 5, food.y - 5, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

// variables initialization
  const canvas = document.getElementById('game')
  const ctx = canvas.getContext('2d')

  const DIRECTION = {
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "down"
  }

  const DIMENSIONS = [canvas.width, canvas.height]
  let difficultyLevel = 1
  const step = 10
  let currentDirection = DIRECTION.RIGHT
  let food = generateFood()

  let snake = generateSnake()

  drawGrid()
  drawSnake()
  drawFood()

  assignControlButtons();
})();

