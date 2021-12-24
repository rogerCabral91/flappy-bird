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

function areSuperimposed(elementA, elementB) {
  const a = elementA.getBoundingClientRect();
  const b = elementB.getBoundingClientRect();

  const horizontal =
    a.left + (a.width - 12) >= b.left && b.left + b.width >= a.left;

  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

  return horizontal && vertical;
}

function crashed(bird, barriers) {
  let crashed = false;
  barriers.pairs.forEach((pairOfBarriers) => {
    if (!crashed) {
      const top = pairOfBarriers.top.element;
      const bottom = pairOfBarriers.bottom.element;
      crashed =
        areSuperimposed(bird.element, top) ||
        areSuperimposed(bird.element, bottom);
    }
  });
  return crashed;
}

function Bird(gameHeight) {
  let flying = false;

  this.element = newElement("img", "bird");
  this.element.src = "../img/bird.png";

  this.getY = () => parseInt(this.element.style.bottom.split("px")[0]);
  this.setY = (y) => (this.element.style.bottom = `${y}px`);

  window.onkeydown = (e) => (e.keyCode === 32 ? (flying = true) : false);
  window.onkeyup = (e) => (e.keyCode == 32 ? (flying = false) : true);

  this.animate = () => {
    const newY = this.getY() + (flying ? 8 : -5);
    const maximumHeight = gameHeight - this.element.clientHeight;

    if (newY <= 0) {
      this.setY(0);
    } else if (newY >= maximumHeight) {
      this.setY(maximumHeight);
    } else {
      this.setY(newY);
    }
  };

  this.setY(gameHeight / 2);
}

function Progress() {
  this.element = newElement("span", "progress");
  this.scorePoint = (points) => {
    this.element.innerHTML = points;
  };
  this.scorePoint(0);
}

function FlappyBird() {
  let points = 0;

  const gameArea = document.querySelector("[fb-flappy]");
  const height = gameArea.clientHeight;
  const width = gameArea.clientWidth;

  const progress = new Progress();
  const barriers = new Barriers(height, width, 200, 400, () =>
    progress.scorePoint(++points)
  );
  const bird = new Bird(height);

  gameArea.appendChild(progress.element);
  gameArea.appendChild(bird.element);
  barriers.pairs.forEach((pair) => gameArea.appendChild(pair.element));

  this.start = () => {
    const timer = setInterval(() => {
      barriers.animate();
      bird.animate();

      if (crashed(bird, barriers)) {
        clearInterval(timer);
        if (confirm(`You scored ${points} points! To play again click OK`)) {
          window.location.reload();
        }
      }
    }, 20);
  };
}
new FlappyBird().start();
