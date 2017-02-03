var gameScreen = document.getElementById("game");
gameScreen.width=SCREEN_WIDTH;
gameScreen.height=SCREEN_HEIGHT;
var ctx = gameScreen.getContext("2d");

//splash screen and instruction screen variables
var splash = new Image();
var play = new Image();
var instruction = new Image();
var cont = new Image();
splash.src = PATH_SPLASH;
play.src = PATH_PLAY;
instruction.src = PATH_INSTR;
cont.src = PATH_CONT;

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
function drawInstruction(){
    requestAnimationFrame(drawInstruction);
    alert("Hello! I am an alert box!!");
    ctx.drawImage(cont,
                    currentX, currentY,
                    CONT_WIDTH, CONT_HEIGHT,
                    350,350);
}


function playGameButton(evt){
  //display controls and instuructions for the game
    var widthRange=PLAY_WIDTH+PLAY_X;
    var heightRange=PLAY_HEIGHT+PLAY_Y;
    if(evt.pageX > PLAY_X &&
       evt.pageX < widthRange &&
       evt.pageY >PLAY_Y &&
       evt.pageY < heightRange){
        ctx.beginPath();
        ctx.rect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
        ctx.fillStyle="#000000";
        ctx.fill();
        //draw instructions
        ctx.drawImage(instruction, 0, 0);
        gameScreen.addEventListener("click", continueButton);
        drawInstruction;
    }
}

function continueButton(evt){

}


