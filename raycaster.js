const canvas = document.getElementById("raycastCanvas");
const context = canvas.getContext("2d");

let px = 300;
let py = 300;
let pa = 0;
let pdx = Math.cos(pa) * 5;
let pdy = Math.sin(pa) * 5;
let mapX = 8;
let mapY = 8;
let mapS = 64;
let PI2 = Math.PI / 2;
let PI3 = 3*(Math.PI / 2);

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

function drawPlayerDirection()
{
    context.beginPath();
    context.moveTo(px + 4, py + 4);
    context.lineTo(px + pdx * 5, py + pdy * 5);
    context.strokeStyle = "yellow";
    context.stroke();
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
            context.moveTo(xo + 1, yo + 1);
            context.lineTo(xo + 1, yo+mapS -1);
            context.lineTo(xo+mapS - 1, yo+mapS - 1);
            context.lineTo(xo+mapS - 1, yo + 1);
            context.fill();
            context.closePath();
        }
    }
}

function drawRays()
{
    let r;
    let mx;
    let my;
    let mp;
    let dof;
    let rx;
    let ry;
    let ra;
    let xo;
    let yo;
    ra = pa;
    for (r = 0; r < 1; r++)
    {
        dof = 0;
        let aTan = -1/Math.tan(ra);
        if (ra > Math.PI)
        {
            ry = ((py>>6)<<6)-0.0001;
            rx = (py-ry)*aTan + px;
            yo=-64;
            xo=-yo*aTan;
        }
        if (ra < Math.PI)
        {
            ry = ((py>>6)<<6)+64;
            rx = (py-ry)*aTan + px;
            yo=64;
            xo=-yo*aTan;
        }
        if (ra == 0 || ra == Math.PI)
        {
            rx = px;
            ry = py;
            dof = 8;
        }
        while(dof<8)
        {
            mx = rx >> 6;
            my = ry >> 6;
            mp = my * mapX + mx;
            if (mp < mapX * mapY && map[mp] == 1)
            {
                dof = 8;
            }
            else
            {
                rx += xo;
                ry += yo;
                dof++;
            }
        }
        context.beginPath();
        context.moveTo(px + 4, py + 4);
        context.lineTo(rx, ry);
        context.strokeStyle = "green";
        context.lineWidth = 10;
        context.stroke();
        context.closePath();

        dof = 0;
        let nTan = -Math.tan(ra);
        if (ra > PI2 && ra < PI3)
        {
            rx = ((px>>6)<<6)-0.0001;
            ry = (px-rx)*nTan + py;
            xo=-64;
            yo=-xo*nTan;
        }
        if (ra < PI2 || ra > PI3)
        {
            rx = ((px>>6)<<6)+64;
            ry = (px-rx)*nTan + py;
            xo=64;
            yo=-xo*nTan;
        }
        if (ra == 0 || ra == Math.PI)
        {
            rx = px;
            ry = py;
            dof = 8;
        }
        while(dof<8)
        {
            mx = rx >> 6;
            my = ry >> 6;
            mp = my * mapX + mx;
            if (mp < mapX * mapY && map[mp] == 1)
            {
                dof = 8;
            }
            else
            {
                rx += xo;
                ry += yo;
                dof++;
            }
        }
        context.beginPath();
        context.moveTo(px + 4, py + 4);
        context.lineTo(rx, ry);
        context.strokeStyle = "red";
        context.lineWidth = 3;
        context.stroke();
        context.closePath();
    }
}

function drawEverything()
{
    clearScreen();
    drawMap2D();
    drawPlayer();
    drawPlayerDirection();
    drawRays();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e)
{
    if (e.key === "d" || e.key === "ArrowRight")
    {
        pa += 0.1;
        if (pa > 2 * Math.PI)
        {
            pa -= 2*Math.PI;
        }
        pdx = Math.cos(pa) * 5;
        pdy = Math.sin(pa) * 5;
    }
    if (e.key === "a" || e.key === "ArrowLeft")
    {
        pa -= 0.1;
        if (pa < 0)
        {
            pa += 2*Math.PI;
        }
        pdx = Math.cos(pa) * 5;
        pdy = Math.sin(pa) * 5;
    }
    if (e.key === "w" || e.key === "ArrowUp")
    {
        px += pdx;
        py += pdy;
    }
    if (e.key === "s" || e.key === "ArrowDown")
    {
        px -= pdx;
        py -= pdy;
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

setInterval(drawEverything, 1);