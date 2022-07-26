class State {
  constructor({ color, thickness, backgroundColor, pixels, width }) {
    this.color = color;
    this.thickness = thickness;
    this.pixels = pixels;
    this.backgroundColor = backgroundColor;
    this.width = width;
  }

  static generateEmpty({ width, height, backgroundColor, color, thickness }) {
    let pixels = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        pixels.push(backgroundColor);
      }
    }

    return new State({
      color,
      thickness,
      backgroundColor,
      width,
      pixels,
    });
  }

  getPixel(x, y) {
    return this.pixels[x + y * this.width];
  }

  setPixels(pixels) {
    let copy = [...this.pixels];

    for (let i = 0; i < pixels.length; i++) {
      const { x, y, color } = pixels[i];
      copy[x + y * this.width] = color;
    }

    return new State({
      color: this.color,
      thickness: this.thickness,
      width: this.width,
      backgroundColor: this.backgroundColor,
      pixels: copy,
    });
  }
}

export default State;
