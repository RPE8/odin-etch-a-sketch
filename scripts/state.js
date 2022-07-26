class State {
  constructor({ color, thickness, pixels }) {
    this.color = color;
    this.thickness = thickness;
    this.pixels = pixels;
  }

  getPixel(x, y) {
    return this.pixels[y]?.[x];
  }

  setPixels(pixels) {
    let copy = this.pixels.slice();
    for (let y = 0; y < pixels.length; y++) {
      for (let x = 0; x < pixels[y].length; x++) {
        copy[y][x] = pixels[y][x];
      }
    }
    return new State({
      color: this.color,
      thickness: this.thickness,
      pixels: copy,
    });
  }
}

export default State;
