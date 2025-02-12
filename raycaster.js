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
let DR = 0.0174533;

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

function dist(ax, ay, bx, by, ang)
{
    return Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
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
    let disT;
    ra = pa - DR*30;
    if (ra < 0)
    {
        ra += 2*Math.PI;
    }
    if (ra > 2*Math.PI)
    {
        ra -= 2*Math.PI;
    }
    for (r = 0; r < 60; r++)
    {
        dof = 0;
        let disH = 1000000;
        hx = px;
        hy = py;
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
            if (mp > 0 && mp < mapX * mapY && map[mp] == 1)
            {
                hx = rx;
                hy = ry;
                disH = dist(px, py, hx, hy, ra);
                dof = 8;
            }
            else
            {
                rx += xo;
                ry += yo;
                dof++;
            }
        }

        dof = 0;
        let disV = 1000000;
        let vx = px;
        let vy = py;
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
            if (mp > 0 && mp < mapX * mapY && map[mp] == 1)
            {
                vx = rx;
                vy = ry;
                disV = dist(px, py, vx, vy, ra);
                dof = 8;
            }
            else
            {
                rx += xo;
                ry += yo;
                dof++;
            }
        }
        if (disV < disH)
        {
            rx = vx;
            ry = vy;
            disT = disV;
            context.strokeStyle = "#E40400";
        }
        if (disH < disV)
        {
            rx = hx;
            ry = hy;
            disT = disH;
            context.strokeStyle = "#B20300";
        }
        else
        {
            context.strokeStyle = "red";
        }

        context.beginPath();
        context.moveTo(px + 4, py + 4);
        context.lineTo(rx, ry);
        context.stroke();
        context.closePath();

        let ca = pa - ra;
        if (ca < 0)
        {
            ca += 2*Math.PI;
        }
        if (ca > 2*Math.PI)
        {
            ca -= 2*Math.PI;
        }
        disT = disT * Math.cos(ca);
        let lineH = (mapS * 320) / disT;
        let lineO = 160 - lineH / 2;
        if (lineH > 320)
        {
            lineH = 320;
        }
        context.beginPath();
        context.lineWidth = 8;
        context.moveTo(r*8 + 530, lineO);
        context.lineTo(r*8 + 530, lineH + lineO);
        context.stroke();
        context.closePath();

        ra += DR;
        if (ra < 0)
        {
            ra += 2*Math.PI;
        }
        if (ra > 2*Math.PI)
        {
            ra -= 2*Math.PI;
        }
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