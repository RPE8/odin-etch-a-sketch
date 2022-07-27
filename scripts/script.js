import Line from "./line.js";
import State from "./state.js";

const canvasContainer = document.getElementById("draw-panel");
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

const resizeObserver = new ResizeObserver(
  throttle((entries) => {
    // setTimeout(() => {
    const { contentRect } = entries[0];
    // Without - 5 container will grow infinitly, probably, because of 'vh' in it's height
    canvas.height =
      window.innerWidth > 1024 ? contentRect.height : contentRect.height - 80;
    canvas.width = canvasContainer.clientWidth;
    updateCanvasOffsets();
    state.stack.forEach((action) => {
      action.draw(ctx);
    });
    // }, 0);
  }, 1)
);

// Observe one or multiple elements
resizeObserver.observe(document.getElementById("main-content"));

window.addEventListener(
  "scroll",
  debounce(() => {
    updateCanvasOffsets();
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
  clearCanvas();
  state = state.clearStacks();
});

const undoButton = document.getElementById("undo");
undoButton.addEventListener("click", () => {
  state = state.moveLastActionFromStackToRedoStack();
  clearCanvas();
  state.stack.forEach((action) => {
    action.draw(ctx);
  });
});

const redoButton = document.getElementById("redo");
redoButton.addEventListener("click", () => {
  state = state.moveLastActionFromRedoStackToStack();
  clearCanvas();
  state.stack.forEach((action) => {
    action.draw(ctx);
  });
});

function clearCanvas() {
  ctx.clearRect(0, 0, ctx_rect.width, ctx_rect.height);
}

function updateCanvasOffsets() {
  ctx_rect = canvas.getBoundingClientRect();
}

const startTouch = attachTouchStart(canvas);
const mouseDown = attachMouseDown(canvas);
attachTouchEnd(canvas);
attachMouseUp(canvas);
attachTouchMove(canvas);
attachMouseMove(canvas);
let currentPos = {};

function attachMouseDown(element) {
  const down = {
    down: null,
    line: null,
  };

  const handleMouseDown = (event) => {
    if (event.button !== 0) {
      return;
    }

    console.log("down");

    down.down = true;

    currentPos.x = getOffsetX(event.clientX);
    currentPos.y = getOffsetY(event.clientY);

    down.line = new Line({
      color: state.color,
      thickness: state.thickness,
    });
  };

  element.addEventListener("mousedown", handleMouseDown);

  return down;
}

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

function attachMouseUp(element) {
  const handleMouseUp = (event) => {
    if (event.button !== 0) {
      return;
    }

    console.log("up");
    mouseDown.down = false;
    const line = mouseDown.line;
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
  };

  element.addEventListener("mouseup", handleMouseUp);
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

function attachMouseMove(element) {
  const handleMouseMove = (event) => {
    if (!mouseDown?.down) {
      return;
    }

    console.log("move");
    const x = getOffsetX(event.clientX);
    const y = getOffsetY(event.clientY);

    const line = mouseDown.line;

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

  element.addEventListener("mousemove", handleMouseMove);
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
