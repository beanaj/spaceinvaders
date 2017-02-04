var gameScreen = document.getElementById("game");
gameScreen.width=SCREEN_WIDTH;
gameScreen.height=SCREEN_HEIGHT;
var ctx = gameScreen.getContext("2d");
//-----GLOBAL VARIABLES
var score=0;
var lifes=3;
var playGame=false;
var gb = new Image();
gb.src = PATH_GB;
var gover= new Image();
gover.src = PATH_GAMEOVER;
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
    gameScreen.addEventListener("click", playGameButton);
}


//variables for draw instruction animations
var currentX= CONT_START_X;
var currentY= CONT_START_Y;
var animID;
function draw(){
    setTimeout(function(){

    animID=requestAnimationFrame(draw);
    }, 1000/ 2);
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
    }else{
        ctx.drawImage(gb, 0, 0);
    }


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


