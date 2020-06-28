function loadUsername() {
    let person = prompt("Please enter your name", "Nevena Soldat");
    let username = "";

    if (person == null || person == "") {
        username = "Unknown username";
    } else {
        username = person;
    }
    
    return username;
};

const sendResult = async (username, result) => {
    try { 
        const URL = 'http://localhost:3002/';
        const response = await fetch(URL, {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            mode : 'cors',
            body : JSON.stringify({
                name : username,
                score : result
            })
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        
    } catch (err) {
        console.error(err);
    }
}

class Paddle {
    constructor(paddlePosition, paddleWidth) {
        this._paddlePosition = paddlePosition;
        this._paddleWidth = paddleWidth;
    }  
    get paddlePosition() {
        return this._paddlePosition;
    }
    get paddleWidth() {
        return this._paddleWidth;
    }
    set movePaddle(x) {
        this._paddlePosition = this._paddlePosition + x;
    }
}

class Ball {
    constructor(x, y, ballSize) {
        this._x = x;
        this._y = y;
        this._ballSize = ballSize;
    }  
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set xchange(step) {
        this._x = this._x + step;
    }
    set ychange(step) {
        this._y = this._y + step;
    }
    get ballSize() {
        return this._ballSize;
    }
}


var gameCanvas = document.getElementById("gameCanvas");
var gameContext = gameCanvas.getContext("2d");
var score = 0;

function showScore() {
    gameContext.font = "16px Arial";
    gameContext.fillStyle = "#585858";
    gameContext.fillText("Score: " + score, 980, 20);
}


var rightArrowPressed = false;
var leftArrowPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

paddle = new Paddle(gameCanvas.width/2, 75);
ball = new Ball(gameCanvas.width/2, gameCanvas.height, 10);
    
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightArrowPressed = true;
    }
    else if(e.keyCode == 37) {
        leftArrowPressed = true;
    }
    else
    {
        rightArrowPressed = false;
        leftArrowPressed = false;
    }		
}

function keyUpHandler(e) {
    if(e.keyCode == 37 || e.keyCode == 39) {
        rightArrowPressed = false;
        leftArrowPressed = false;
    }
}

function drawPaddleAndBall()
{
    gameContext.beginPath();
    gameContext.rect(paddle.paddlePosition, gameCanvas.height-10, paddle.paddleWidth, 10);
    gameContext.fillStyle = "black";
    gameContext.fill();
    gameContext.closePath();
    
    gameContext.beginPath();
    gameContext.arc(ball.x, ball.y, ball.ballSize, 0, Math.PI*2);
    gameContext.fillStyle = "green";
    gameContext.fill();
    gameContext.closePath();
}

var brickRows = 17;
var brickColumns = 10;
var brickWidth = 50;
var brickHeight = 20;
var brickPadding = 10;
var bricks = [];

for(var i=0; i<brickColumns; i++) {
    bricks[i] = [];
    for(var j=0; j<brickRows; j++) {
        bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
}

function drawBricks() {
    for(var i=0; i<brickColumns; i++) {
        for(var j=0; j<brickRows; j++) {
            if(bricks[i][j].status == 1) {
                var brickX = (j*(brickWidth+brickPadding) + 35);
                var brickY = (i*(brickHeight+brickPadding)) + 35;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                gameContext.beginPath();
                gameContext.rect(brickX, brickY, brickWidth, brickHeight);
                gameContext.fillStyle = "grey";
                gameContext.fill();
                gameContext.closePath();
            }
        }
    }
}


function updateBricksStatus() {
    for(var i=0; i<brickColumns; i++) {
        for(var j=0; j<brickRows; j++) {
            var brick = bricks[i][j];
            if(brick.status == 1) {
                if(ball.x > brick.x && ball.x < brick.x + brickWidth) {
                    if(ball.y > brick.y && ball.y < brick.y+brickHeight) {					
                        yBallStep = -yBallStep;
                        brick.status = 0;
                        score++;
                    }							
                }
            }
        }
    }
}  
        
function AlertsModule(bricks, brickColumns, brickRows)
{
    function gameFinished(bricks, brickColumns, brickRows) {
        for(var i=0; i<brickColumns; i++) {
            for(var j=0; j<brickRows; j++) {
                if(bricks[i][j].status == 1) {
                    return;
                }
                window.alert("Congratulations! You won!");       
                let username;
                username = loadUsername();
                sendResult(username, score);
            }
        }
    }
    
    function gameOver() {
        window.alert("Game over! Your score is: " + score);
        let username;
        username = loadUsername();
        sendResult(username, score);
    }
    
    return {
        finished : gameFinished,
        gameover : gameOver
    };
}

var alerts = AlertsModule(bricks, brickColumns, brickRows); 


var xBallStep = -5;
var yBallStep = -5;

function draw() {	
gameContext.clearRect(0, 0, 1080, 720);
    
drawPaddleAndBall();
drawBricks();
updateBricksStatus();
alerts.finished(); 
showScore();
    
if(rightArrowPressed && paddle.paddlePosition < gameCanvas.width-paddle.paddleWidth) {
    paddle.movePaddle = 6;
}
else if(leftArrowPressed && paddle.paddlePosition > 0) {
    paddle.movePaddle = -6;
}
    
if(ball.x + xBallStep > gameCanvas.width- ball.ballSize || ball.x+xBallStep < ball.ballSize) {
    xBallStep = -xBallStep;
}
if(ball.y + yBallStep < ball.ballSize) {
    yBallStep = -yBallStep;
}
else if(ball.y+yBallStep > gameCanvas.height-ball.ballSize) {
    if(ball.x > paddle.paddlePosition && ball.x < paddle.paddlePosition + paddle.paddleWidth) {
        yBallStep = -yBallStep;
    } else if(ball.y - 20 > gameCanvas.height) {
        alerts.gameover();
        exit();
    }
}
                    
ball.xchange = xBallStep;
ball.ychange = yBallStep;
    
window.requestAnimationFrame(draw);
}

draw();
