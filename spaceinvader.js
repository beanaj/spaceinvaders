var gameScreen = document.getElementById("game");
gameScreen.width=SCREEN_WIDTH;
gameScreen.height=SCREEN_HEIGHT;
var ctx = gameScreen.getContext("2d");
//-----GLOBAL VARIABLES
var score=0000
var highScore= 0000;
var lifes=6;
var bubbleLives=5;
var bubbleSubtract = false;
var playGame=false;
var gameOver=false;
//main game images
var gb = new Image();
gb.src = PATH_GB;

//gameover screen
var gover= new Image();
gover.src = PATH_GAMEOVER;

//life counters
var lifeImage= new Image();
lifeImage.src = PATH_LIVES;

//bubble counters
var bubbleLife = new Image();
bubbleLife.src = PATH_BUBBLES_LEFT;

//cannon image
var cannon = new Image();
cannon.src = PATH_CANNON;
//cannon controls
var rightDown= false;
var leftDown= false;
var spaceDown = false;
var sDown = false;

//loading screen for images etc.

ctx.beginPath();
ctx.rect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
ctx.fillStyle="#000000";
ctx.fill();

ctx.font = "30px Lucida Console";
ctx.fillStyle = "white";
ctx.textAlign = "center";
ctx.fillText("loading!",150,200);

//splash screen and instruction screen variables
var splash = new Image();
var play = new Image();
var instruction = new Image();
var cont = new Image();

splash.src = PATH_SPLASH;
play.src = PATH_PLAY;
instruction.src = PATH_INSTR;
cont.src = PATH_CONT;
cont.onload = setReady;


function setReady(){
    this.ready=true;
}



splash.onload = function(){
    ctx.beginPath();
    ctx.rect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
    ctx.fillStyle="#000000";
    ctx.fill();

    var x=25;

    ctx.drawImage(splash, x, 0);

    //add play! option
}

play.onload = function(){
    ctx.drawImage(play, PLAY_X, PLAY_Y);
    init();
    gameScreen.addEventListener("click", playGameButton);
}

//controls initilization
function init(){
    window.addEventListener('keydown',keyDown,true);
	window.addEventListener('keyup',keyUp,true);
}

function keyDown(evt) {
    if (evt.keyCode == 39) 			rightDown = true;
    else if (evt.keyCode == 37) 	leftDown = true;
    else if (evt.keyCode == 32)       spaceDown = true;
    else if (evt.keyCode == 83)       sDown = true;
}

function keyUp(evt) {
    if (evt.keyCode == 39) 			rightDown = false;
    else if (evt.keyCode == 37) 	leftDown = false;
    else if (evt.keyCode == 32)     spaceDown = false;
    else if (evt.keyCode == 83)       sDown = false;
}

//variables for draw instruction animations
var currentX= CONT_START_X;
var currentY= CONT_START_Y;
//for lives
var lifex= LIVES_START_X;
var lifey= LIVES_START_Y;
//for bubble lifes
var bubblelifex = BUBBLES_START_X;
var bubblelifey = BUBBLES_START_Y;
//for cannon
var canx = CANNON_START_X;
var cany = CANNON_START_Y;
var canFlip=false;
var animID;
var fps=2;
var angle = 0;
function draw(){
    setTimeout(function(){

    animID=requestAnimationFrame(draw);
    }, 1000/ fps);
    if(playGame==false){
        ctx.beginPath();
        ctx.rect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
        ctx.fillStyle="#000000";
        ctx.fill();
        //draw instructions
        ctx.drawImage(instruction, 0, 0);
        ctx.drawImage(cont, currentX, currentY, CONT_WIDTH, CONT_HEIGHT, CONT_X, CONT_Y, CONT_WIDTH, CONT_HEIGHT);

        currentY+=CONT_HEIGHT;
        if(currentY>=CONT_MAX_Y){
            currentY=0;
        }
    }else if(gameOver==true){
        ctx.drawImage(gover, 0, 0);
        setTimeout(function(){playGame=false;
                              gameOver=false;
                              lifes=6;
                              lifey=0;
                              score=0;
                              bubbleLives=5;
                             },5000);

    }else{
        fps=60;
        ctx.drawImage(gb, 0, 0);
        //adding all text, high schor, score, lives and credits
        //score and high score static
        ctx.font = "16px Lucida Console";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText("S C O R E < 1 > H I - S C O R E < 2 >",15, 20);

        //score and high score dynamic
        ctx.font = "16px Lucida Console";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(scorePad(score),115, 40);
        //highscore
        ctx.font = "16px Lucida Console";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(scorePad(highScore),330, 40);

        //adding the lives
        ctx.font = "16px Lucida Console";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(lifes,10, 390);

        switch(lifes) {
        case 5:
            lifey=LIVES_HEIGHT;
            break;
        case 4:
            lifey=LIVES_HEIGHT*2;
            break;
        case 3:
            lifey=3*LIVES_HEIGHT;
            break;
        case 2:
            lifey=4*LIVES_HEIGHT;
            break;
        case 1:
            lifey=5*LIVES_HEIGHT;
            break;
        }

        ctx.drawImage(lifeImage, lifex, lifey, LIVES_WIDTH, LIVES_HEIGHT, LIVES_X, LIVES_Y, LIVES_WIDTH, LIVES_HEIGHT);
        if(lifes==0){
            gameOver=true;
        }

        //adding bubble lives
        switch(bubbleLives) {
            case 5:
                bubblelifey=0;
                break;
            case 4:
                bubblelifey=BUBBLES_HEIGHT;
                break;
            case 3:
                bubblelifey=2*BUBBLES_HEIGHT;
                break;
            case 2:
                bubblelifey=3*BUBBLES_HEIGHT;
                break;
            case 1:
                bubblelifey=4*BUBBLES_HEIGHT;
                break;
            case 0:
                bubblelifey=5*BUBBLES_HEIGHT;
                break;
            }

        ctx.drawImage(bubbleLife, bubblelifex, bubblelifey, BUBBLES_WIDTH, BUBBLES_HEIGHT, BUBBLES_X, BUBBLES_Y, BUBBLES_WIDTH, BUBBLES_HEIGHT);

        //adding cannon

        ctx.drawImage(cannon, canx, cany, CANNON_WIDTH, CANNON_HEIGHT, CANNON_X, CANNON_Y, CANNON_WIDTH, CANNON_HEIGHT);
        //animating the cannon jets
        if(canFlip==true){
            canx+=CANNON_WIDTH;
            canFlip=false;
        }else{
            canx=0;
            canFlip=true;
        }
        //controlling cannon movement
        if(rightDown==true&&CANNON_X<=GB_RIGHT_BORDER){

        }else if(leftDown==true&&CANNON_X>=GB_LEFT_BORDER){

        }else if(spaceDown==true){
            ctx.font = "16px Lucida Console";
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText("BANG!",200, 200);
        }else if(sDown==true&&bubbleLives>0){
            bubbleLives-=1;
            sDown=false;
            ctx.font = "16px Lucida Console";
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText("Shield!",CANNON_X, CANNON_Y-20);
        }

        //adding invaders!
        //creating invader object
        //row 3
        var topInvaders = {

        }

    }


}

function scorePad(score){
    score = ""+ score;
    var pad ="0000"
    var padded = pad.substring(0, pad.length-score.length)+score;
    return padded;
}

function playGameButton(evt){
  //display controls and instuructions for the game
    var widthRange=PLAY_WIDTH+PLAY_X;
    var heightRange=PLAY_HEIGHT+PLAY_Y;
    if(evt.pageX > PLAY_X &&
       evt.pageX < widthRange &&
       evt.pageY >PLAY_Y &&
       evt.pageY < heightRange){
        gameScreen.addEventListener("click", gameStart);
        draw();
    }
}

function gameStart(evt){
    var widthRange=CONT_WIDTH+CONT_X;
    var heightRange=CONT_WIDTH+CONT_Y;
    if(evt.pageX > CONT_X &&
       evt.pageX < widthRange &&
       evt.pageY >CONT_Y &&
       evt.pageY < heightRange){
            playGame=true;
    }
}


