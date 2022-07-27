import Line from "./line.js";
import State from "./state.js";

const canvasContainer = document.getElementById("canvas-container");
const canvas = document.createElement("canvas");
canvasContainer.appendChild(canvas);

const ctx = canvas.getContext("2d");
let ctx_rect = canvas.getBoundingClientRect();

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

function debounce(fn, time) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
}

function throttle(fn, time) {
  let timer;

  return (...args) => {
    let timeSinceLastExecution = Date.now() - timer;
    if (!timer || timeSinceLastExecution >= time) {
      fn.apply(this, args);
      timer = Date.now();
    }
  };
}

const canvasObserver = new ResizeObserver(
  throttle((entries) => {
    const { contentRect } = entries[0];
    // Without - 5 container will grow infinitly, probably, because of 'vh' in it's height
    canvas.height = contentRect.height - 5;
    canvas.width = contentRect.width;
    state.stack.forEach((action) => {
      action.draw(ctx);
    });
  }, 25)
);

// Observe one or multiple elements
canvasObserver.observe(canvasContainer);

window.addEventListener(
  "scroll",
  debounce(() => {
    ctx_rect = canvas.getBoundingClientRect();
  }, 100)
);

const colorButton = document.getElementById("color");
colorButton.setAttribute("value", state.color);
colorButton.addEventListener("change", (event) => {
  const selectedColor = event.target.value;
  colorButton.setAttribute("value", selectedColor);
  state = state.setColor(selectedColor);
});

const thicknessRange = document.getElementById("range");
thicknessRange.setAttribute("value", state.thickness);
thicknessRange.addEventListener("change", (event) => {
  const selectedTchickness = Number(event.target.value);
  thicknessRange.setAttribute("value", selectedTchickness);
  state = state.setThickness(selectedTchickness);
});

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, ctx_rect.width, ctx_rect.height);
  state = state.clearStacks();
});

const undoButton = document.getElementById("undo");
undoButton.addEventListener("click", () => {
  state = state.moveLastActionFromStackToRedoStack();
  ctx.clearRect(0, 0, ctx_rect.width, ctx_rect.height);
  state.stack.forEach((action) => {
    action.draw(ctx);
  });
});

const redoButton = document.getElementById("redo");
redoButton.addEventListener("click", () => {
  state = state.moveLastActionFromRedoStackToStack();
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
