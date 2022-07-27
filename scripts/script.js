import Line from "./line.js";
import State from "./state.js";

const canvasContainer = document.getElementById("canvas-container");
const canvas = document.createElement("canvas");
canvas.height = canvasContainer.offsetHeight;
canvas.width = canvasContainer.offsetWidth;
canvasContainer.appendChild(canvas);

const ctx = canvas.getContext("2d");
const ctx_rect = canvas.getBoundingClientRect();

const INITIAL_COLOR = "#FF0000";
const INITIAL_THICKNESS = 5;

let state = State.generateEmpty({
  color: INITIAL_COLOR,
  thickness: INITIAL_THICKNESS,
});

function getOffsetX(x) {
  return x - ctx_rect.left;
}

function getOffsetY(y) {
  return y - ctx_rect.top;
}

const colorButton = document.getElementById("color");
colorButton.setAttribute("value", state.color);
document.getElementById("color").addEventListener("change", (event) => {
  const selectedColor = event.target.value;
  colorButton.setAttribute("value", selectedColor);
  state = state.setColor(selectedColor);
});

const thicknessRange = document.getElementById("range");
thicknessRange.setAttribute("value", state.thickness);
thicknessRange.addEventListener("change", (event) => {
  const selectedTchickness = +event.target.value;
  thicknessRange.setAttribute("value", selectedTchickness);
  state = state.setThickness(selectedTchickness);
});

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, ctx_rect.width, ctx_rect.height);
});

const undoButton = document.getElementById("undo");
undoButton.addEventListener("click", () => {
  state = state.removeLastFromStack();
  ctx.clearRect(0, 0, ctx_rect.width, ctx_rect.height);
  state.stack.forEach((action) => {
    action.draw(ctx);
  });
});

const redoButton = document.getElementById("redo");
redoButton.addEventListener("click", () => {
  state = state.removeLastFromRedoStack();
  ctx.clearRect(0, 0, ctx_rect.width, ctx_rect.height);
  state.stack.forEach((action) => {
    action.draw(ctx);
  });
});

const startTouch = attachTouchStart(canvas);
attachTouchEnd(canvas);
attachTouchMove(canvas);
let currentPos = {};

function attachTouchStart(element) {
  const touch = {
    touches: null,
    line: null,
  };

  const handleTouchStart = (event) => {
    touch.touches = event.touches;
    const mainTouch = event.touches[0];

    currentPos.x = getOffsetX(mainTouch.clientX);
    currentPos.y = getOffsetY(mainTouch.clientY);

    touch.line = new Line({
      color: state.color,
      thickness: state.thickness,
    });
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
    const line = startTouch.line;
    if (line.points.length) {
      line.addPoint({
        xStart: currentPos.x,
        yStart: currentPos.y,
        xEnd: currentPos.x,
        yEnd: currentPos.y,
      });
      line.drawLastPoint(ctx);
      state = state.addToStack(line);
    }
    console.log(state);
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
    const x = getOffsetX(mainTouch.clientX);
    const y = getOffsetY(mainTouch.clientY);

    const line = startTouch.line;

    line.addPoint({
      xStart: currentPos.x,
      yStart: currentPos.y,
      xEnd: x,
      yEnd: y,
    });

    line.drawLastPoint(ctx);

    currentPos.x = x;
    currentPos.y = y;
  };

  element.addEventListener("touchmove", handleTouchMove);

  return touchMove;
}
