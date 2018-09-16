import p5 from 'p5' 
import 'reset-css'
import './scss/style.scss'

new p5((p5) => {
  p5.setup = () => {
    p5.createCanvas(window.innerWidth, window.innerHeight)
  }

  p5.draw = () => {
    p5.background(0);
    p5.noFill();

    p5.stroke(255);
    p5.point(p5.width * 0.5, p5.height * 0.5);
    p5.point(p5.width * 0.5, p5.height * 0.25);
  }
})
