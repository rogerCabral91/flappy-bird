function newElement(tagName, className) {
  const customElement = document.createElement(tagName);
  customElement.className = className;
  return customElement;
}

function Barrier(reverse = false) {
  this.element = newElement("div", "barrier");

  const barrierBorder = newElement("div", "barrier-edge");
  const barrierBody = newElement("div", "barrier-body");
  this.element.appendChild(reverse ? barrierBody : barrierBorder);
  this.element.appendChild(reverse ? barrierBorder : barrierBody);

  this.setHeight = (height) => (barrierBody.style.height = `${height}px`);
}

function PairOfBarriers(height, opening, x) {
  this.element = newElement("div", "pair-of-barriers");

  this.top = new Barrier(true);
  this.bottom = new Barrier(false);

  this.element.appendChild(this.top.element);
  this.element.appendChild(this.bottom.element);

  this.drawOpening = () => {
    const upperHeight = Math.random() * (height - opening);
    const lowerHeight = height - opening - upperHeight;
    this.top.setHeight(upperHeight);
    this.bottom.setHeight(lowerHeight);
  };

  this.getX = () => parseInt(this.element.style.left.split("px")[0]);
  this.setX = (x) => (this.element.style.left = `${x}px`);
  this.getWidth = () => this.element.clientWidth;

  this.drawOpening();
  this.setX(x);
}

function Barriers(height, width, opening, spacing, scorePoint) {
  this.pairs = [
    new PairOfBarriers(height, opening, width),
    new PairOfBarriers(height, opening, width + spacing),
    new PairOfBarriers(height, opening, width + spacing * 2),
    new PairOfBarriers(height, opening, width + spacing * 3),
  ];

  const displacement = 3;
  this.animate = () => {
    this.pairs.forEach((pair) => {
      pair.setX(pair.getX() - displacement);

      if (pair.getX() < -pair.getWidth()) {
        pair.setX(pair.getX() + spacing * this.pairs.length);
        pair.drawOpening();
      }

      const middle = width / 2;
      const crossedMiddle =
        pair.getX() + displacement >= middle && pair.getX() < middle;
      if (crossedMiddle) scorePoint();
    });
  };
}

const barriers = new Barriers(700, 1200, 200, 400);
const gameArea = document.querySelector("[fb-flappy]");
barriers.pairs.forEach((pair) => gameArea.appendChild(pair.element));
setInterval(() => {
  barriers.animate();
}, 20);
