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
    const mainTouch = event.changedTouches[0];
    if (
      currentPos.x === mainTouch.clientX - ctx_rect.left &&
      currentPos.y === mainTouch.clientY - ctx_rect.top
    ) {
      draw(currentPos.x, currentPos.y, currentPos.x, currentPos.y);
    }
  };

  canvas.addEventListener("touchend", handleTouchEnd);

  return touch;
}

function attachTouchMove(element) {
  const touchMove = {
    touches: null,
    x: null,
    y: null,
  };

  const handleTouchMove = (event) => {
    console.log("TouchMove");
    touchMove.touches = event.touches;
    const mainTouch = event.touches[0];
    const x = mainTouch.clientX - ctx_rect.left;
    const y = mainTouch.clientY - ctx_rect.top;

    draw(currentPos.x, currentPos.y, x, y);

    currentPos.x = x;
    currentPos.y = y;
  };

  canvas.addEventListener("touchmove", handleTouchMove);

  return touchMove;
}

function draw(oldX, oldY, newX, newY) {
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(oldX, oldY);
  ctx.lineTo(newX, newY);
  ctx.stroke();
}
