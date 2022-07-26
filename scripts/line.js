class Line {
  constructor({ points = [], color, thickness }) {
    this.points = points;
    this.color = color;
    this.thickness = thickness;
  }
}

Line.prototype.draw = function (target, points = this.points) {
  target.lineWidth = this.thickness;
  target.lineCap = "but";

  // ctx.globalAlpha = opacity;
  target.strokeStyle = this.color;

  target.beginPath();

  points.forEach((point) => {
    target.moveTo(point.xStart, point.yStart);
    target.lineTo(point.xEnd, point.yEnd);
  });

  target.stroke();
};

Line.prototype.addPoint = function (point) {
  this.points.push(point);
};

Line.prototype.getLastPoint = function () {
  return this.points[this.points.length - 1];
};

Line.prototype.drawPoint = function (target, point) {
  this.draw(target, [point]);
};

Line.prototype.drawLastPoint = function (target) {
  this.drawPoint(target, this.getLastPoint());
};

Line.prototype.applyAction = function (target) {
  this.draw(target);
};

export default Line;
