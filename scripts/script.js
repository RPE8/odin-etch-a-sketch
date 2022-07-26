import State from "./state/state.js";

const canvasContainer = document.getElementById("canvas-container");
const canvas = document.createElement("canvas");
canvas.height = canvasContainer.offsetHeight;
canvas.width = canvasContainer.offsetWidth;
canvasContainer.appendChild(canvas);

let color = "#FF0000";
let thickness = 1;

let state = State.generateEmpty({
  color,
  thickness,
});

console.log(state);

const ctx = canvas.getContext("2d"),
  ctx_rect = ctx.canvas.getBoundingClientRect();

const colorPicker = document.getElementById("color");

colorPicker.addEventListener("change", (event) => {
  const selectedColor = event.target.value;
  colorPicker.setAttribute("value", selectedColor);
  color = selectedColor;
});

const clearButton = document.getElementById("clear");

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, ctx_rect.width, ctx_rect.height);
});

attachTouchStart(canvas);
attachTouchEnd(canvas);
attachTouchMove(canvas);
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

  element.addEventListener("touchstart", handleTouchStart);

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

  element.addEventListener("touchend", handleTouchEnd);

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

  element.addEventListener("touchmove", handleTouchMove);

  return touchMove;
}

function draw(oldX, oldY, newX, newY) {
  ctx.lineWidth = 2;
  ctx.lineCap = "but";

  // ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;

  ctx.beginPath();
  ctx.moveTo(oldX, oldY);
  ctx.lineTo(newX, newY);
  ctx.stroke();
}
