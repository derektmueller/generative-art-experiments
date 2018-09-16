import p5 from 'p5';
import 'reset-css';
import './scss/style.scss';

let config = {
  historyLength: 3,
  pointCount: 200,
}

class Point {
  constructor(x, y, history=[]) {
    this.x = x;
    this.y = y;
    this.history = history;
  }
}

function pushHistory(prev, curr) {
  return new Point(
    curr.x, curr.y, 
    [new Point(prev.x, prev.y)].concat(curr.history.slice(0, config.historyLength)));
}

function mapPoint(f, point) {
  return new Point(f(point.x), f(point.y), point.history);
}

function moveRandomly(point) {
  return pushHistory(
    point, 
    mapPoint(x => x + (Math.random() * 2 - 1), point)
  );
}

function drawPoint(p5, point) {
  p5.point(point.x, point.y);
  point.history.map((point) => drawPoint(p5, point));
}

class State {
  constructor() {
    this.points = [];
  }
}

new p5((p5) => {
  let state = new State;

  p5.setup = () => {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    state.points = (new Array(config.pointCount)).fill(0).map(() =>
      new Point(window.innerWidth / 2, window.innerHeight / 2));
  };

  p5.draw = () => {
    p5.background(0);
    p5.noFill();
    p5.stroke(255);
    state.points = state.points.map((point) => moveRandomly(point));
    state.points.forEach((point) => drawPoint(p5, point));
  };
});
