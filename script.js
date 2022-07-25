console.log("test)=");
const canvasContainer = document.getElementById("canvas-container");

const canvas = document.createElement("canvas");
canvas.height = canvasContainer.offsetHeight;
canvas.width = canvasContainer.offsetWidth;
canvasContainer.appendChild(canvas);
const ctx = canvas.getContext("2d"),
  ctx_rect = ctx.canvas.getBoundingClientRect();

let touchStart = attachTouchStart(canvas);
let touchEnd = attachTouchEnd(canvas);
let toucheMove = attachTouchMove(canvas);
let currentPos = {};

function attachTouchStart(element) {
  const touch = {
    touches: null,
  };

  const handleTouchStart = (event) => {
    console.log("TouchStart");
    touch.touches = event.touches;
    const mainTouch = event.touches[0];
    currentPos.x = mainTouch.clientX - ctx_rect.left;
    currentPos.y = mainTouch.clientY - ctx_rect.top;
  };

  canvas.addEventListener("touchstart", handleTouchStart);

  return touch;
}

function attachTouchEnd(element) {
  const touch = {
    touches: null,
  };

  const handleTouchEnd = (event) => {
    console.log("TouchEnd");
    touch.touches = event.touches;
  };

  canvas.addEventListener("touchend", handleTouchEnd);

  return touch;
}

function attachTouchMove(element) {
  const touch = {
    touches: null,
  };

  const handleTouchMove = (event) => {
    console.log("TouchMove");
    touch.touches = event.touches;
    const mainTouch = event.touches[0];

    draw(mainTouch.clientX, mainTouch.clientY);
  };

  canvas.addEventListener("touchmove", handleTouchMove);

  return touch;
}

function draw(x, y) {
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(currentPos.x, currentPos.y);
  currentPos.x = x - ctx_rect.left;
  currentPos.y = y - ctx_rect.top;
  ctx.lineTo(currentPos.x, currentPos.y);
  ctx.stroke();
}
