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

//bubble shield image
var bubbleShield = new Image();
bubbleShield.src = PATH_BUBBLES_SHIELD;

//missle image
var missleimg = new Image();
missleimg.src = PATH_MISS;

//invaders images
//top row
var topInvaderImage= new Image();
topInvaderImage.src = PATH_TOP_INVADER;
//mid row
var midInvaderImage = new Image();
midInvaderImage.src = PATH_MID_INVADER;
//bottom rows
var bottomInvaderImage = new Image();
bottomInvaderImage.src = PATH_BOT_INVADER;
//explosion image
var explosion = new Image();
explosion.src = PATH_EXPLOSION;
//missle explosion
var misexplosion = new Image();
misexplosion.src = PATH_MISEXPLOSION;


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
var counter=0;
var animID;
var fps=2;
var angle = 0;

//for bubble shields
//initializing the array of bubble shields
var bubbleArray= new Array();
var shieldx= BUBBLE_SHIELD_START_X;
var shieldy= BUBBLE_SHIELD_START_Y;

//for friendly missle
var missle = new cannonMissle(-100, -100, false, false);
var missleAlive=false;
var missleSpeed=5;

// for invaders-----------------------------------------
var animateCounter=0;
var animateInvadersBool=true;

//top row
var topRow = new Array();
var topx = 0;
var topy = 0;
var numberOfInvaders=10;

//mid row
var midRow = new Array();
var midx = 0;
var midy = 0;
var numberOfInvadersMid=10;

//first bottom row
var bot1Row = new Array();
var bot1x = 0;
var bot1y = 0;
var numberOfInvadersBot1=10;

//first bottom row
var bot0Row = new Array();
var bot0x = 0;
var bot0y = 0;
var numberOfInvadersBot0=10;

function bubbleInit(){
    for(var i=1; i<=bubbleLives;i++){
        var bubble = new shield(i, -100, -100, false, false, 4);
        bubbleArray.push(bubble);
    }
}

function bubbleDraw(){
    for(var i=0; i<5;i++){
        if(bubbleArray[i].inField==true&&bubbleArray[i].isDead==false){
             ctx.drawImage(bubbleShield, shieldx, shieldy, BUBBLE_SHIELD_WIDTH, BUBBLE_SHIELD_HEIGHT, bubbleArray[i].x, bubbleArray[i].y, BUBBLE_SHIELD_WIDTH, BUBBLE_SHIELD_HEIGHT);
        }
    }
}

function missleLaunch(){

        if(missle.y>0){
            ctx.drawImage(missleimg, missle.x, missle.y);
            missle.y-=missleSpeed;
            var bool=contactExplosion();
            if(bool){
                missle.y=0;
            }
        }else if(missle.y<=0){
            ctx.beginPath();
            ctx.rect(missle.x,missle.y,11,10);
            ctx.fillStyle="#000000";
            ctx.fill();
            missleAlive=false;
        }else if(missle.y<20){
            ctx.drawImage(misexplosion, missle.x, missle.y);
        }


}

function row3init(){
    var invadery=100;
    var invaderx=26;
    for(var i=1; i<=numberOfInvaders;i++){
        var invaders = new invader(invaderx, invadery, true, false);
        topRow.push(invaders);
        invaderx+=35;
    }
}

function row2init(){
    var invadery=130;
    var invaderx=28;
    for(var i=1; i<=numberOfInvaders;i++){
        var invaders = new invader(invaderx, invadery, true, false);
        midRow.push(invaders);
        invaderx+=35;
    }
}

function row1init(){
    var invadery=160;
    var invaderx=25;
    for(var i=1; i<=numberOfInvaders;i++){
        var invaders = new invader(invaderx, invadery, true, false);
        bot1Row.push(invaders);
        invaderx+=35;
    }
}

function row0init(){
    var invadery=190;
    var invaderx=25;
    for(var i=1; i<=numberOfInvaders;i++){
        var invaders = new invader(invaderx, invadery, true, false);
        bot0Row.push(invaders);
        invaderx+=35;
    }
}

//testing for contact
function contactExplosion(){
    //sizes of invader bounds for contact
    for(var i=0; i<numberOfInvaders;i++){
        var invaderx=topRow[i].x;
        var invadery=topRow[i].y;
        var topInvaderxhigh=invaderx+TOPINV_WIDTH-10;
        var topInvaderyhigh=invadery+TOPINV_HEIGHT-10;
        if(invaderx<missle.x&&invadery<missle.y&&
          topInvaderxhigh>missle.x&&topInvaderyhigh>missle.y&&
          topRow[i].alive==true){
            score += 30;
            if(score>highScore){
                highScore+=30;
            }

            topRow[i].explode=true;
            return true;
        }
    }
}

function invadersDraw(){
    if(animateCounter%75==0){
        if(animateInvadersBool==true){
            topx+=TOPINV_WIDTH;
            midx+=MIDINV_WIDTH;
            bot1x+=BOTINV_WIDTH;
            bot0x+=BOTINV_WIDTH;
            animateInvadersBool=false;
        }else{
            topx=0;
            midx=0;
            bot1x=0;
            bot0x=0;
            animateInvadersBool=true;
        }

    }
    animateCounter++;
    for(var i=0; i<numberOfInvaders;i++){
        if(topRow[i].explode==true){
            ctx.drawImage(explosion, topx, topy, TOPINV_WIDTH, TOPINV_HEIGHT, topRow[i].x+5, topRow[i].y, 0.75*TOPINV_WIDTH, 0.75*TOPINV_HEIGHT);
            topRow[i].explode=false;
            topRow[i].alive=false;
        }else{
            if(topRow[i].alive==true){
                ctx.drawImage(topInvaderImage, topx, topy, TOPINV_WIDTH, TOPINV_HEIGHT, topRow[i].x, topRow[i].y, 0.75*TOPINV_WIDTH, 0.75*TOPINV_HEIGHT);
            }
        }
        ctx.drawImage(midInvaderImage, midx, midy, MIDINV_WIDTH, MIDINV_HEIGHT, midRow[i].x, midRow[i].y, 0.9*MIDINV_WIDTH, 0.9*MIDINV_HEIGHT);

        ctx.drawImage(bottomInvaderImage, bot1x, bot1y, BOTINV_WIDTH, BOTINV_HEIGHT, bot1Row[i].x, bot1Row[i].y, 0.9*BOTINV_WIDTH, 0.9*BOTINV_HEIGHT);

        ctx.drawImage(bottomInvaderImage, bot0x, bot0y, BOTINV_WIDTH, BOTINV_HEIGHT, bot0Row[i].x, bot0Row[i].y, 0.9*BOTINV_WIDTH, 0.9*BOTINV_HEIGHT);
    }

    //catching overflow
    if(animateCounter>10000){
        animateCounter=0;
    }
}

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
        if(counter%10==0){
            if(canx==0){
                canx+=CANNON_WIDTH;
            }else{
                canx=0;
            }
        }
        counter++;
        //catching the rare chance for overflow
        if(counter>101){
            counter=0;
        }
        //controlling cannon movement


        if(rightDown==true&&CANNON_X<=GB_RIGHT_BORDER){
            CANNON_X+=3;
        }else if(leftDown==true&&CANNON_X>=GB_LEFT_BORDER){
            CANNON_X-=3;
        }else if(spaceDown==true){
            if(missleAlive==false){
                missleAlive=true;
                missle.x=CANNON_X+17;
                missle.y=CANNON_Y-10;
            }
        }else if(sDown==true&&bubbleLives>0){
            var ID=bubbleLives-1;
            bubbleArray[ID].x=CANNON_X;
            bubbleArray[ID].y=CANNON_Y-30;
            bubbleArray[ID].inField=true;
            bubbleLives-=1;
            sDown=false;
        }
        missleLaunch();
        bubbleDraw();
        //adding invaders!

        invadersDraw();
    }


}

//function for the shield objects
function shield(bubbleLives, x, y, inField, isDead, HP){
    this.ID=bubbleLives;
    this.x=x;
    this.y=y;
    this.inField=inField;
    this.isDead=isDead;
    this.HP=HP;
}
//function for friendly missle objects
function cannonMissle(x, y, inField, isDead){
    this.x=x;
    this.y=y;
    this.inField=inField;
    this.isDead=isDead;
}

//function for top row of invaders
function invader(x, y, alive, explode){
    this.x=x;
    this.y=y;
    this.alive=alive;
    this.explode=explode;
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
            bubbleInit();
            row3init();
            row2init();
            row1init();
            row0init();
            playGame=true;
    }
}


