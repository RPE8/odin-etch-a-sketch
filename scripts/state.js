class State {
  constructor({ stack, color, thickness }) {
    this.color = color;
    this.thickness = thickness;
    this.stack = stack;
  }

  static generateEmpty({ color, thickness }) {
    return new State({
      color,
      thickness,
      stack: [],
    });
  }

  addToStack(action) {
    const stackCopy = [...this.stack];
    stackCopy.push(action);
    return new State({
      stack: stackCopy,
      color: this.color,
      thickness: this.thickness,
    });
  }

  removeLastFromStack() {
    const stackCopy = this.stack.slice(0, this.stack.length - 1);
    return new State({
      stack: stackCopy,
      color: this.color,
      thickness: this.thickness,
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
