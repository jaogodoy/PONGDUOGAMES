$(document).ready(function() {
    let gameInterval = null;
    let gameActive = false; 
    const tecla = {
        W: 87,
        S: 83,
        UP: 38,
        DOWN: 40
    };
    

    const jogo = {
        pressionou: [],
        player1Y: 200,
        player2Y: 200,
        ballX: 400,
        ballY: 250,
        ballSpeedX: 5,
        ballSpeedY: 5,
        score1: 0,
        score2: 0
    };


    const elements = {
        player1: $('#player1'),
        player2: $('#player2'),
        ball: $('#ball'),
        scoreElement: $('#score'),
        startScreen: $('#start-screen'),
        gameOverScreen: $('#game-over-screen'),
        winnerText: $('#winner-text'),
        gameContainer: $('#game-container'),
        audio: document.getElementById('game-sound')
    };

 
    function initGame() {
        resetGameState();
        bindEvents();
    }


    function resetGameState() {
        jogo.score1 = 0;
        jogo.score2 = 0;
        jogo.player1Y = 200;
        jogo.player2Y = 200;
        updateScore();
        updatePositions();
        elements.ball.hide();
        elements.gameOverScreen.hide();
        elements.startScreen.show();
    }


    function bindEvents() {
        $(document).on('keydown', function(e) {
            if (gameActive) jogo.pressionou[e.which] = true;
        });

        $(document).on('keyup', function(e) {
            if (gameActive) jogo.pressionou[e.which] = false;
        });

        $('#start-button').on('click', startGame);
        $('#restart-button').on('click', restartGame);
    }


    function startGame() {
        elements.startScreen.hide();
        elements.gameContainer.removeClass('game-ended');
        gameActive = true;
        resetBall();
        startGameLoop();
        
        if (elements.audio) {
            elements.audio.currentTime = 0;
            elements.audio.play().catch(e => console.log("Áudio:", e));
        }
    }


    function restartGame() {
        stopGame();
        resetGameState();
        startGame();
    }

    function startGameLoop() {
        stopGameLoop();
        gameInterval = setInterval(gameLoop, 30);
    }


    function gameLoop() {
        if (!gameActive) return;
        
        movePlayers();
        moveBall();
        checkCollision();
        updatePositions();
    }


    function stopGameLoop() {
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
    }


    function stopGame() {
        stopGameLoop();
        gameActive = false;
        elements.gameContainer.addClass('game-ended');
        
        if (elements.audio) {
            elements.audio.pause();
        }
    }


    function movePlayers() {
        if (!gameActive) return;

        if (jogo.pressionou[tecla.W] && jogo.player1Y > 0) {
            jogo.player1Y -= 8;
        }
        if (jogo.pressionou[tecla.S] && jogo.player1Y < 400) {
            jogo.player1Y += 8;
        }

        if (jogo.pressionou[tecla.UP] && jogo.player2Y > 0) {
            jogo.player2Y -= 8;
        }
        if (jogo.pressionou[tecla.DOWN] && jogo.player2Y < 400) {
            jogo.player2Y += 8;
        }
    }


    function moveBall() {
        if (!gameActive) return;
        
        jogo.ballX += jogo.ballSpeedX;
        jogo.ballY += jogo.ballSpeedY;
        

        if (jogo.ballY <= 0 || jogo.ballY >= 485) {
            jogo.ballSpeedY = -jogo.ballSpeedY;
        }
        

        if (jogo.ballX <= 0) {
            jogo.score2++;
            handleScore();
        }
        if (jogo.ballX >= 785) {
            jogo.score1++;
            handleScore();
        }
    }


    function handleScore() {
        updateScore();
        
        if (jogo.score1 >= 5 || jogo.score2 >= 5) {
            endGame();
        } else {
            resetBall();
        }
    }


    function endGame() {
        stopGame();
        elements.ball.hide();
        elements.winnerText.text(`${jogo.score1 >= 5 ? 'PLAYER 1' : 'PLAYER 2'} VENCEU!`);
        elements.gameOverScreen.fadeIn(300);
    }


    function checkCollision() {
        if (!gameActive) return;
        

        if (jogo.ballX <= 35 && jogo.ballX >= 20 && 
            jogo.ballY + 15 >= jogo.player1Y && jogo.ballY <= jogo.player1Y + 100) {
            rebaterBola(jogo.player1Y, true);
        }
        

        if (jogo.ballX >= 750 && jogo.ballX <= 765 && 
            jogo.ballY + 15 >= jogo.player2Y && jogo.ballY <= jogo.player2Y + 100) {
            rebaterBola(jogo.player2Y, false);
        }
    }


    function rebaterBola(paddleY, isPlayer1) {

        const maxSpeed = 20;
        const speedMultiplier = 1.10;
 
        jogo.ballSpeedX = Math.max(Math.min(-jogo.ballSpeedX * speedMultiplier, maxSpeed), -maxSpeed);
    
        const hitPosition = (jogo.ballY - paddleY) / 100 - 0.5;

        jogo.ballSpeedY += hitPosition * 8;

        jogo.ballSpeedY = Math.max(Math.min(jogo.ballSpeedY * speedMultiplier, maxSpeed), -maxSpeed);
    }


    function updatePositions() {
        elements.player1.css('top', jogo.player1Y + 'px');
        elements.player2.css('top', jogo.player2Y + 'px');
        elements.ball.css({ 
            'left': jogo.ballX + 'px', 
            'top': jogo.ballY + 'px' 
        });
    }


    function resetBall() {
        stopGameLoop();
        
        jogo.ballX = 400;
        jogo.ballY = 250;
        jogo.ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
        jogo.ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
        
        elements.ball.show();

        setTimeout(() => {
            if (gameActive) {
                startGameLoop();
            }
        }, 1000);
    }


    function updateScore() {
        elements.scoreElement.text(`${jogo.score1} - ${jogo.score2}`);
    }


    initGame();
});