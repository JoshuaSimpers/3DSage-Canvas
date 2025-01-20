const canvas = document.getElementById("raycastCanvas");
const context = canvas.getContext("2d");

let px = 300;
let py = 300;
let mapX = 8;
let mapY = 8;
let mapS = 64;

let map = 
[
    1,1,1,1,1,1,1,1,
    1,0,1,0,0,0,0,1,
    1,0,1,0,0,0,0,1,
    1,0,1,0,0,0,0,1,
    1,0,0,0,0,0,0,1,
    1,0,0,0,0,1,0,1,
    1,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1
]; 

function clearScreen()
{
    //clears the screen
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer()
{
    context.beginPath();
    context.rect(px, py, 8, 8);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
}

function drawMap2D()
{
    let x;
    let y;
    let xo;
    let yo;
    for (y=0; y<mapY; y++)
    {
        for (x=0; x<mapX; x++)
        {
            if (map[y*mapX+x]==1)
            {
                context.fillStyle = "white";
            }
            else
            {
                context.fillStyle = "black";
            }
            xo = x*mapS;
            yo = y*mapS;
            context.beginPath();
            context.moveTo(xo, yo);
            context.lineTo(xo, yo+mapS);
            context.lineTo(xo+mapS, yo+mapS);
            context.lineTo(xo+mapS, yo);
            context.fill();
            context.closePath();
        }
    }
}

function drawEverything()
{
    clearScreen();
    drawMap2D();
    drawPlayer();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e)
{
    if (e.key === "d" || e.key === "ArrowRight")
    {
        px+=5;
    }
    if (e.key === "a" || e.key === "ArrowLeft")
    {
        px-=5;
    }
    if (e.key === "w" || e.key === "ArrowUp")
    {
        py-=5;
    }
    if (e.key === "s" || e.key === "ArrowDown")
    {
        py+=5;
    }
}

function keyUpHandler(e)
{
    if (e.key === "Right" || e.key === "ArrowRight")
    {
        rightPressed = false;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft")
    {
        leftPressed = false;
    }
}

setInterval(drawEverything, 100);