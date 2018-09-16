import p5 from 'p5';
import 'reset-css';
import './scss/style.scss';

const pointCount = 20;

function mkConfig() {
  return {
    historyLength: Math.random() * 40 + 20,
    maxDelta: Math.random() * 50 + 20,
    maxStrokeWidth: Math.random() * 8 + 1,
    boundaryRadiusY: (p5) => 50,
    boundaryRadius: (p5) => window.innerWidth / 2
  }
}

class Point {
  constructor(x, y, config, history=[]) {
    this.x = x;
    this.y = y;
    this.history = history;
    this.config = config;
  }
}

function pushHistory(prev, curr) {
  return new Point(
    curr.x, curr.y, curr.config,
    [new Point(prev.x, prev.y, prev.config)].concat(
      curr.history.slice(0, prev.config.historyLength)));
}

function mapInBoundary(p5, f, point) {
  let x = Infinity;
  let y = Infinity;
  var maxIter = 5;
  var i = 0;
  while(x > (window.innerWidth / 2 + point.config.boundaryRadius(p5)) ||
        x < (window.innerWidth / 2 - point.config.boundaryRadius(p5))) {
    i++;
    x = f(point.x, point.config);
    if(i > maxIter) {
      x = point.x;
      break;
    }
  }

  i = 0;
  while(y > (window.innerHeight / 2 + point.config.boundaryRadiusY(p5)) ||
        y < (window.innerHeight / 2 - point.config.boundaryRadiusY(p5))) {
    i++;
    y = f(point.y, point.config);
    if(i > maxIter) {
      y = point.y;
      break;
    }
  }

  return [x, y];
}

function mapPoint(p5, f, point) {
  let [x, y] = mapInBoundary(p5, f, point);

  return new Point(
    x, 
    y,
    point.config, 
    point.history
  );
}

function moveMap(p5, point, f) {
  return pushHistory(
    point, 
    mapPoint(p5, f, point)
  );
}

function drawPoint(p5, point) {
  p5.point(point.x, point.y);
  p5.strokeJoin(p5.ROUND);

  (point.history.reduce((acc, point, i) => {
    return () => {
      let prev = acc();

      p5.strokeWeight(
        p5.dist(point.x, point.y, prev.x, prev.y) / 
        (Math.sqrt(Math.pow(point.config.maxDelta, 2) * 2)) * 
        point.config.maxStrokeWidth);
      p5.line(point.x, point.y, prev.x, prev.y);

      return point;
    };
  }, () => point))();
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
    state.points = (new Array(pointCount)).fill(0).map(() =>
      new Point(window.innerWidth / 2, window.innerHeight / 2, mkConfig()));
  };

  p5.draw = () => {
    p5.background('gray');
    p5.noFill();
    p5.stroke(255);
    p5.strokeWeight(1);

    const f = (x, config) => {
      return x + (Math.random() * config.maxDelta - config.maxDelta / 2);
    };

    state.points = state.points.map((point) => moveMap(p5, point, f));
    state.points.forEach((point) => drawPoint(p5, point));
  };
});
