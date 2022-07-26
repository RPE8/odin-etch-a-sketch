class State {
  constructor({ stack, color, thickness }) {
    this.color = color;
    this.thickness = thickness;
    this.stack = stack;
  }

  static generateEmpty(color, thickness) {
    return new State({
      color,
      thickness,
      stack: [],
    });
  }
}

export default State;
