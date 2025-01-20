const canvas = document.getElementById("raycastCanvas");
const context = canvas.getContext("2d");

let px;
let py;

function drawPlayer()
{
    context.beginPath();
    context.rect(px, py, 8, 8);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
}

function drawEverything()
{
    px = 300;
    py = 300;
    drawPlayer();
}

drawEverything();