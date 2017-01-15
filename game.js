var canvas;
var canvasContext;

// ball specs
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var playerScore = 0;
var compyScore = 0;

var showingWinScreen = false;

// paddle specs
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

// win condition
const WINNING_SCORE = 3;



function calculateMousePos(event) {
   var rect = canvas.getBoundingClientRect();
   var root = document.documentElement;
   var mouseX = event.clientX - rect.left - root.scrollLeft;
   var mouseY = event.clientY - rect.top - root.scrollTop;
   return {
      x: mouseX,
      y: mouseY
   }
}

function handleMouseClick(event) {
  if (showingWinScreen) {
    playerScore = 0;
    compyScore = 0;
    showingWinScreen = false;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  
  // creates crude animation every time the function is called.
  var framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', function(event) {
    var mousePos = calculateMousePos(event);
    paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
  })
}

function ballReset() {
  if (playerScore >= WINNING_SCORE || compyScore >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

// monitors the balls position relative to compy paddle. If the ball is above the paddle it moves up towards it, vice versa
function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y += -6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;
  
  // handles the logic for the ball going off the right side (compy) of screen
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      // handles return angle from contact point on paddle
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;
    } else {
      playerScore++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  // handles logic for ball going off left (player) side of screen
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      // handles return angle from contact point on paddle
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;
    } else {
      compyScore++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect((canvas.width/2 - 1), i, 2, 20, 'white');
  }
}

function drawEverything() {
  
  // sets a black canvas for the game
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  if (showingWinScreen) {
    canvasContext.fillStyle = 'white';

     if (playerScore >= WINNING_SCORE) {
      canvasContext.fillText("Left Player Won!", 350, 200);
    }
    else if (compyScore >= WINNING_SCORE) {
      canvasContext.fillText("Right Player Won!", 350, 200);
    }
    canvasContext.fillText("click to continue", 350, 500);
    return;
  }

  drawNet();
  // left player paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
  // right computer paddle
  colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
  // the ball
  colorCircle(ballX, ballY, 10, 'white');

  // the score
  canvasContext.fillText(playerScore, 100, 100);
  canvasContext.fillText(compyScore, canvas.width - 100, 100)
}


function colorCircle(centerX, centerY, radius, color) {
  
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  // first two args are height and width of circle, 3 is radius, 4 + 5 are angles and radians around circle 
  // and 6 (boolean) is 
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}


function colorRect(leftX, topY, width, height, color) {
  
  canvasContext.fillStyle = color;
  // the 0, 0 corresponds to the top right corner, 
  canvasContext.fillRect(leftX, topY, width, height);
}

