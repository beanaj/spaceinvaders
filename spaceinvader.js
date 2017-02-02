var gameScreen = document.getElementById("game");
gameScreen.width=SCREEN_WIDTH;
gameScreen.height=SCREEN_HEIGHT;
var ctx = gameScreen.getContext("2d");
//splash screen
var splash= new Image();
splash.src = PATH_SPLASH;

splash.onload = function(){
    ctx.beginPath();
    ctx.rect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
    ctx.fillStyle="#000000";
    ctx.fill();
    var x=25;
    while(true){
    ctx.drawImage(splash, x, 0);
    }
}
