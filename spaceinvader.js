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

//gamewin screen
var gwin= new Image();
gwin.src = PATH_GAMEWIN;

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

//mother ship missle
var mothermissleimg = new Image();
mothermissleimg.src = PATH_MOTHER_MISS;

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
//mothership image
var mothershipImage= new Image();
mothershipImage.src = PATH_MOTHERSHIP;



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
    var x=25;
    play.onload = function(){
        ctx.beginPath();
        ctx.rect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
        ctx.fillStyle="#000000";
        ctx.fill();
        ctx.drawImage(play, PLAY_X, PLAY_Y);
        ctx.drawImage(splash, x, 0);
        init();
        gameScreen.addEventListener("click", playGameButton);
    }
    //add play! option
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
var respawn=false;
var counter=0;
var animID;
var fps=2;
var angle = 0;
var music = new Audio();
music.src = GAME_MUSIC;
var musicInterval=0.005;

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
var speed=.1;
var speedSave=speed;
var left=false;
var right=true;
var down=false;
var lostLife=false;
//top row
var topRow = new Array();
var topx = 0;
var topy = 0;
var numberOfInvaders=10;
var topCount=0;

//mid row
var midRow = new Array();
var midx = 0;
var midy = 0;
var numberOfInvadersMid=10;
var midCount=0;

//first bottom row
var bot1Row = new Array();
var bot1x = 0;
var bot1y = 0;
var numberOfInvadersBot1=10;
var bot1Count=0;

//last bottom row
var bot0Row = new Array();
var bot0x = 0;
var bot0y = 0;
var numberOfInvadersBot0=10;
var bot0Count=0;

//mothership
var mothership = new motherShip(MOTHER_X, MOTHER_Y, 10, true, false);
var mothershipCount=0;
var motherx = 0;
var mothery = 0;
var motherScore=250;
//mothership missles
var mothermiss1 = new mothershipMissle(-100, -100, false, false);
var mothermiss2 = new mothershipMissle(-100, -100, false, false);
var mothershipMissle1Alive=false;
var mothershipMissle2Alive=false;

function bubbleInit(){
    for(var i=1; i<=bubbleLives;i++){
        var bubble = new shield(i, -100, -100, false, false, 4);
        bubbleArray.push(bubble);
    }
}

function bubbleDraw(){
    for(var i=0; i<5;i++){
        if(bubbleArray[i].inField==true&&bubbleArray[i].isDead==false){
            switch(bubbleArray[i].HP){
                case 4:
                    ctx.drawImage(bubbleShield, shieldx, shieldy, BUBBLE_SHIELD_WIDTH, BUBBLE_SHIELD_HEIGHT, bubbleArray[i].x, bubbleArray[i].y, BUBBLE_SHIELD_WIDTH, BUBBLE_SHIELD_HEIGHT);
                    break;
                case 3:
                    ctx.drawImage(bubbleShield, shieldx, shieldy+BUBBLE_SHIELD_HEIGHT, BUBBLE_SHIELD_WIDTH, BUBBLE_SHIELD_HEIGHT, bubbleArray[i].x, bubbleArray[i].y, BUBBLE_SHIELD_WIDTH, BUBBLE_SHIELD_HEIGHT);
                    break;
                case 2:
                    ctx.drawImage(bubbleShield, shieldx, shieldy+(2*BUBBLE_SHIELD_HEIGHT), BUBBLE_SHIELD_WIDTH, BUBBLE_SHIELD_HEIGHT, bubbleArray[i].x, bubbleArray[i].y, BUBBLE_SHIELD_WIDTH, BUBBLE_SHIELD_HEIGHT);
                    break;
                case 1:
                    ctx.drawImage(bubbleShield, shieldx, shieldy+(3*BUBBLE_SHIELD_HEIGHT+1), BUBBLE_SHIELD_WIDTH, BUBBLE_SHIELD_HEIGHT, bubbleArray[i].x, bubbleArray[i].y, BUBBLE_SHIELD_WIDTH, BUBBLE_SHIELD_HEIGHT);
                    break;
            }


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

            missleAlive=false;
        }else if(missle.y<20){
            ctx.drawImage(misexplosion, missle.x, missle.y);
        }


}

function mothershipMissleLaunch(){
    if(mothershipMissle1Alive==true&&mothershipMissle2Alive==true){
        if(mothermiss1.y<SCREEN_HEIGHT-33){
            ctx.drawImage(mothermissleimg, mothermiss1.x, mothermiss1.y);
            mothermiss1.y+=missleSpeed;
            var bool=motherMissHit();
            if(bool){
                mothermiss1.y=0;
                mothershipMissle1Alive=false;
            }
        }else if(mothermiss1.y>=SCREEN_HEIGHT-33){
            mothershipMissle1Alive=false;
        }

        if(mothermiss2.y<SCREEN_HEIGHT-33){
            ctx.drawImage(mothermissleimg, mothermiss2.x, mothermiss2.y);
            mothermiss2.y+=missleSpeed;
            var bool=motherMissHit();
            if(bool){
                mothermiss2.y=0;
                mothershipMissle2Alive=false;
            }
        }else if(mothermiss2.y>=SCREEN_HEIGHT-33){
            mothershipMissle2Alive=false;
        }
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
    //bot0 hit detection
    for(var i=0; i<numberOfInvaders;i++){
        var invaderx=bot0Row[i].x;
        var invadery=bot0Row[i].y;
        var topInvaderxhigh=invaderx+BOTINV_WIDTH-8;
        var topInvaderyhigh=invadery+BOTINV_HEIGHT-10;
        if(invaderx<missle.x&&invadery<missle.y&&
          topInvaderxhigh>missle.x&&topInvaderyhigh>missle.y&&
          bot0Row[i].alive==true){
            score += 5;
            if(score>highScore){
                highScore+=5;
            }
            music.playbackRate+=musicInterval;
            speed+=.01;
            bot0Row[i].explode=true;
            return true;
        }
    }
    //bot1 hit detection
    for(var i=0; i<numberOfInvaders;i++){
        var invaderx=bot1Row[i].x;
        var invadery=bot1Row[i].y;
        var topInvaderxhigh=invaderx+BOTINV_WIDTH-8;
        var topInvaderyhigh=invadery+BOTINV_HEIGHT-10;
        if(invaderx<missle.x&&invadery<missle.y&&
          topInvaderxhigh>missle.x&&topInvaderyhigh>missle.y&&
          bot1Row[i].alive==true){
            score += 10;
            if(score>highScore){
                highScore+=10;
            }
            music.playbackRate+=musicInterval;
            speed+=.02;
            bot1Row[i].explode=true;
            return true;
        }
    }
    //middle row detection
    for(var i=0; i<numberOfInvaders;i++){
        var invaderx=midRow[i].x;
        var invadery=midRow[i].y;
        var topInvaderxhigh=invaderx+MIDINV_WIDTH-8;
        var topInvaderyhigh=invadery+MIDINV_HEIGHT-10;
        if(invaderx<missle.x&&invadery<missle.y&&
          topInvaderxhigh>missle.x&&topInvaderyhigh>missle.y&&
          midRow[i].alive==true){
            score += 20;
            if(score>highScore){
                highScore+=20;
            }
            music.playbackRate+=musicInterval;
            speed+=.02;
            midRow[i].explode=true;
            return true;
        }
    }
//top row detection
    for(var i=0; i<numberOfInvaders;i++){
        var invaderx=topRow[i].x;
        var invadery=topRow[i].y;
        var topInvaderxhigh=invaderx+TOPINV_WIDTH-18;
        var topInvaderyhigh=invadery+TOPINV_HEIGHT-10;
        if(invaderx<missle.x&&invadery<missle.y&&
          topInvaderxhigh>missle.x&&topInvaderyhigh>missle.y&&
          topRow[i].alive==true){
            score += 30;
            if(score>highScore){
                highScore+=30;
            }
            music.playbackRate+=musicInterval;
            speed+=.02;
            topRow[i].explode=true;
            return true;
        }
    }
//mothership hit detection

    var invaderx=mothership.x;
    var invadery=mothership.y;
    var topInvaderxhigh=invaderx+MOTHER_WIDTH;
    var topInvaderyhigh=invadery+MOTHER_HEIGHT-10;
    if(invaderx<missle.x&&invadery<missle.y&&
       topInvaderxhigh>missle.x&&topInvaderyhigh>missle.y&&
       mothership.alive==true){
        if(mothership.HP==1){
            score += motherScore;
            if(score>highScore){
                highScore+=motherScore;
            }
            music.playbackRate+=musicInterval;
            speed+=.05;
            mothership.explode=true;
            mothership.HP-=1;
            return true;
        }else{
            mothership.HP-=1;
            return true;
        }
    }


}

function motherMissHit(){
    for(var i=0; i<5;i++){
        if(bubbleArray[i].HP==0){
            bubbleArray[i].isDead=true;
            bubbleArray[i].inField=false;
        }
        var cannonx= bubbleArray[i].x;
        var cannony= bubbleArray[i].y;
        var topCannonx= cannonx+BUBBLE_SHIELD_WIDTH;
        var topCannony= cannony+BUBBLE_SHIELD_WIDTH;
        var hit=false;
        if(cannonx<mothermiss2.x&&cannony<mothermiss2.y&&
            topCannonx>mothermiss2.x&&topCannony>mothermiss2.y&&
            bubbleArray[i].inField==true){
            bubbleArray[i].HP--;
            hit=true;
        }
        if(cannonx<mothermiss1.x&&cannony<mothermiss1.y&&
            topCannonx>mothermiss1.x&&topCannony>mothermiss1.y&&
            bubbleArray[i].inField==true){
            if(hit!=true){
            bubbleArray[i].HP--;
            }
            hit=true;
        }

        if(hit){
            return true;
        }


    }
    var cannonx= CANNON_X;
    var cannony= CANNON_Y;
    var topCannonx= CANNON_X+CANNON_WIDTH;
    var topCannony= CANNON_Y+CANNON_HEIGHT;
    if(cannonx<mothermiss1.x&&cannony<mothermiss1.y&&
       topCannonx>mothermiss1.x&&topCannony>mothermiss1.y){
        lostLife=true;
        respawn=true;
        CANNON_Y=340;
        CANNON_X=-10000;
        return true;
    }else if(cannonx<mothermiss2.x&&cannony<mothermiss2.y&&
       topCannonx>mothermiss2.x&&topCannony>mothermiss2.y){
        lostLife=true;
        respawn=true;
        CANNON_Y=340;
        CANNON_X=-10000;
        return true;
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

            //launching invader missles
            mothershipMissle1Alive=true;
            mothershipMissle2Alive=true;
            mothermiss1.x=mothership.x+11;
            mothermiss2.x=mothership.x+MOTHER_WIDTH-11;
            mothermiss1.y=mothership.y+MOTHER_HEIGHT;
            mothermiss2.y=mothership.y+MOTHER_HEIGHT;
            //respawning cannon if needed
            if(respawn){
                respawn=false;
                CANNON_X=180;
                CANNON_Y=340;
            }
        }else{
            topx=0;
            midx=0;
            bot1x=0;
            bot0x=0;
            animateInvadersBool=true;

            }

        }

    //this is the counter to shutter flash the animation of the invader sprites
    animateCounter++;
    //catching overflow
    if(animateCounter>10000){
        animateCounter=0;
    }

    //moving the invaders left and right down the screen, increasing in speed as invaders are killed XD
    if(left==true&&down==false){
        for(var i=0; i<numberOfInvaders;i++){
            topRow[i].x-=speed;
            midRow[i].x-=speed;
            bot1Row[i].x-=speed;
            bot0Row[i].x-=speed;
            mothership.x-=speed/2;
            if(topRow[0].x<10){
                down=true;
            }
        }
    }else if(right==true&&down==false){
        for(var i=0; i<numberOfInvaders;i++){
            topRow[i].x+=speed;
            midRow[i].x+=speed;
            bot1Row[i].x+=speed;
            bot0Row[i].x+=speed;
            mothership.x+=speed/2;
            if(topRow[9].x>SCREEN_WIDTH-40){
                down=true;
                }
            }
    }else if(down==true){

        if(left){
            left=false;
            right=true;
        }else{
            left=true;
            right=false;
        }
        down=false;
        for(var j=0; j<numberOfInvaders;j++){
            topRow[j].y+=5;
            midRow[j].y+=5;
            bot1Row[j].y+=5;
            bot0Row[j].y+=5;

            //making sure you lose if the invaders reach the cannon
            if((bot0Row[j].y>=CANNON_Y-CANNON_HEIGHT&&bot0Row[j].alive==true)||
              (bot1Row[j].y>=CANNON_Y-CANNON_HEIGHT&&bot1Row[j].alive==true)||
              (midRow[j].y>=CANNON_Y-CANNON_HEIGHT&&midRow[j].alive==true)||
              (topRow[j].y>=CANNON_Y-CANNON_HEIGHT&&topRow[j].alive==true)){
                gameOver=true;
            }
        }
    }

    //top row drawing
    for(var i=0; i<numberOfInvaders;i++){
        if(topRow[i].explode==true){
            ctx.drawImage(explosion, topRow[i].x+2, topRow[i].y);
            topCount++;
            if(topCount==5){
            topCount=0;
            topRow[i].explode=false;
            topRow[i].alive=false;
            }
        }else{
            if(topRow[i].alive==true){
                ctx.drawImage(topInvaderImage, topx, topy, TOPINV_WIDTH, TOPINV_HEIGHT, topRow[i].x, topRow[i].y, 0.75*TOPINV_WIDTH, 0.75*TOPINV_HEIGHT);
            }
        }

    //middle row drawing
        if(midRow[i].explode==true){
            ctx.drawImage(explosion, midRow[i].x-1, midRow[i].y);
            midCount++;
            if(midCount==5){
            midCount=0;
            midRow[i].explode=false;
            midRow[i].alive=false;
            }
        }else{
            if(midRow[i].alive==true){
                ctx.drawImage(midInvaderImage, midx, midy, MIDINV_WIDTH, MIDINV_HEIGHT, midRow[i].x, midRow[i].y, 0.9*MIDINV_WIDTH, 0.9*MIDINV_HEIGHT);
            }
        }
    //bot1 row drawing
        if(bot1Row[i].explode==true){
            ctx.drawImage(explosion, bot1Row[i].x+2, bot1Row[i].y);
            bot1Count++;
            if(bot1Count==5){
            bot1Count=0;
            bot1Row[i].explode=false;
            bot1Row[i].alive=false;
            }
        }else{
            if(bot1Row[i].alive==true){
                ctx.drawImage(bottomInvaderImage, bot1x, bot1y, BOTINV_WIDTH, BOTINV_HEIGHT, bot1Row[i].x, bot1Row[i].y, 0.9*BOTINV_WIDTH, 0.9*BOTINV_HEIGHT);
            }
        }
    //bot0 row drawing
        if(bot0Row[i].explode==true){
            ctx.drawImage(explosion, bot0Row[i].x+2, bot0Row[i].y);
            bot0Count++;
            if(bot0Count==5){
            bot0Count=0;
            bot0Row[i].explode=false;
            bot0Row[i].alive=false;
            }
        }else{
            if(bot0Row[i].alive==true){
                ctx.drawImage(bottomInvaderImage, bot0x, bot0y, BOTINV_WIDTH, BOTINV_HEIGHT, bot0Row[i].x, bot0Row[i].y, 0.9*BOTINV_WIDTH, 0.9*BOTINV_HEIGHT);
            }
        }
    }
    //mother ship drawing
    if(mothership.explode==true){
            ctx.drawImage(explosion, mothership.x+2, mothership.y);
            mothershipCount++;
            if(mothershipCount==5){
            motherShipCount=0;
            }
            mothership.explode=false;
            mothership.alive=false;

        }else{
            if(mothership.alive==true){
            switch(mothership.HP){
                case 10:
                    ctx.drawImage(mothershipImage, motherx, mothery, MOTHER_WIDTH, MOTHER_HEIGHT, mothership.x, mothership.y, MOTHER_WIDTH, MOTHER_HEIGHT);
                    break;
                case 9:
                    ctx.drawImage(mothershipImage, motherx, mothery, MOTHER_WIDTH, MOTHER_HEIGHT, mothership.x, mothership.y, MOTHER_WIDTH, MOTHER_HEIGHT);
                    break;
                case 8:
                    ctx.drawImage(mothershipImage, motherx, mothery+(MOTHER_HEIGHT), MOTHER_WIDTH, MOTHER_HEIGHT, mothership.x, mothership.y, MOTHER_WIDTH, MOTHER_HEIGHT);
                    break;
                case 7:
                    ctx.drawImage(mothershipImage, motherx, mothery+(MOTHER_HEIGHT), MOTHER_WIDTH, MOTHER_HEIGHT, mothership.x, mothership.y, MOTHER_WIDTH, MOTHER_HEIGHT);
                    break;
                case 6:
                    ctx.drawImage(mothershipImage, motherx, mothery+(2*MOTHER_HEIGHT), MOTHER_WIDTH, MOTHER_HEIGHT, mothership.x, mothership.y, MOTHER_WIDTH, MOTHER_HEIGHT);
                    break;
                case 5:
                    ctx.drawImage(mothershipImage, motherx, mothery+(2*MOTHER_HEIGHT), MOTHER_WIDTH, MOTHER_HEIGHT, mothership.x, mothership.y, MOTHER_WIDTH, MOTHER_HEIGHT);
                    break;
                case 4:
                    ctx.drawImage(mothershipImage, motherx, mothery+(3*MOTHER_HEIGHT), MOTHER_WIDTH, MOTHER_HEIGHT, mothership.x, mothership.y, MOTHER_WIDTH, MOTHER_HEIGHT);
                    break;
                case 3:
                    ctx.drawImage(mothershipImage, motherx, mothery+(3*MOTHER_HEIGHT), MOTHER_WIDTH, MOTHER_HEIGHT, mothership.x, mothership.y, MOTHER_WIDTH, MOTHER_HEIGHT);
                    break;
                case 2:
                    ctx.drawImage(mothershipImage, motherx, mothery+(4*MOTHER_HEIGHT), MOTHER_WIDTH, MOTHER_HEIGHT, mothership.x, mothership.y, MOTHER_WIDTH, MOTHER_HEIGHT);
                    break;
                case 1:
                    ctx.drawImage(mothershipImage, motherx, mothery+(4*MOTHER_HEIGHT), MOTHER_WIDTH, MOTHER_HEIGHT, mothership.x, mothership.y, MOTHER_WIDTH, MOTHER_HEIGHT);
                    break;
            }

            }
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
                              fps=2;
                              respawn=false;
                              CANNON_X=180;
                              CANNON_Y=340;
                              speed=CONSTANT_SPEED;
                              bubbleArray= new Array();
                              topRow=new Array();
                              midRow=new Array();
                              bot0Row=new Array();
                              bot1Row=new Array();
                              missleAlive==false
                              motherScore=250;
                              mothership.x=MOTHER_X;
                              mothership.y=MOTHER_Y;
                              mothership.alive=true;
                              mothership.explode=false;
                              mothership.HP=10;
                              music.playbackRate=1;
                             },5000);

    }else if(gameWin()==true){
        setTimeout(function(){playGame=true;
                              gameOver=false;
                              bubbleLives=5;
                              bubbleArray=new Array();
                              topRow=new Array();
                              midRow=new Array();
                              bot0Row=new Array();
                              bot1Row=new Array();
                              missleAlive==false
                              mothership.x=MOTHER_X;
                              mothership.y=MOTHER_Y;
                              mothership.alive=true;
                              mothership.explode=false;
                              mothership.HP=10;
                              mothershipMissle1Alive=false;
                              mothershipMissle2Alive=false;
                              bubbleInit();
                              row3init();
                              row2init();
                              row1init();
                              row0init();
                              motherScore+=50;
                              speed=speedSave;
                              speed+=.1;
                              music.playbackRate=1;
                             },5000);
    }else{
        music.play();
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
        if(lostLife){
            lifes--;
            lostLife=false;
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
        mothershipMissleLaunch();
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

//function for mothership object
function motherShip(x, y, HP, alive, explode){
    this.x=x;
    this.y=y;
    this.HP=HP;
    this.alive=alive;
    this.explode=explode;
}

//function for mothership missles objects
function mothershipMissle(x, y, inField, isDead){
    this.x=x;
    this.y=y;
    this.inField=inField;
    this.isDead=isDead;
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

function gameWin(){
    var won=true;
    for(var i=0; i<numberOfInvaders;i++){
        if(topRow[i].alive!=false||
           midRow[i].alive!=false||
           bot1Row[i].alive!=false||
           bot0Row[i].alive!=false||
          mothership.alive!=false){
            won=false;
        }
    }
    return won;

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


