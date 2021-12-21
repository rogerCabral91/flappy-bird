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

