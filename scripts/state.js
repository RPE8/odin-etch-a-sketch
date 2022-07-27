class State {
  constructor({ stack = [], redoStack = [], color, thickness }) {
    this.color = color;
    this.thickness = thickness;
    this.stack = stack;
    this.redoStack = redoStack;
  }

  static generateEmpty({ color, thickness }) {
    return new State({
      color,
      thickness,
      stack: [],
      redoStack: [],
    });
  }

  addToStack(action) {
    const stackCopy = [...this.stack];
    stackCopy.push(action);
    return new State({
      stack: stackCopy,
      color: this.color,
      thickness: this.thickness,
      redoStack: [],
    });
  }

  addToRedoStack(action) {
    const redoStackCopy = [...this.redoStack];
    const stackCopy = [...this.stack];
    redoStackCopy.push(action);
    return new State({
      stack: stackCopy,
      color: this.color,
      thickness: this.thickness,
      redoStack: redoStackCopy,
    });
  }

  moveLastActionFromStackToRedoStack() {
    if (!this.stack.length) {
      return this;
    }
    const stackCopy = this.stack.slice(0, this.stack.length - 1);
    return new State({
      stack: stackCopy,
      color: this.color,
      thickness: this.thickness,
      redoStack: [...this.redoStack, this.stack[this.stack.length - 1]],
    });
  }

  moveLastActionFromRedoStackToStack() {
    if (!this.redoStack.length) {
      return this;
    }
    const redoStackCopy = this.redoStack.slice(0, this.redoStack.length - 1);
    return new State({
      stack: [...this.stack, this.redoStack[this.redoStack.length - 1]],
      color: this.color,
      thickness: this.thickness,
      redoStack: redoStackCopy,
    });
  }

  setColor(color) {
    return new State({
      stack: [...this.stack],
      color,
      thickness: this.thickness,
    });
  }

  setThickness(thickness) {
    return new State({
      stack: [...this.stack],
      color: this.color,
      thickness,
    });
  }
}

export default State;
