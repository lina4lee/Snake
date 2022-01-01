class Apple {
  constructor(el) {
    this.node = document.createElement('img');
    this.node.setAttribute('id', 'apple');
    this.node.setAttribute('src', 'src/assets/apple.jpg');

    el.appendChild(this.node);

    //randomize the location of the apple
    const top = Math.ceil(Math.random() * 13) * 50;
    const left = Math.ceil(Math.random() * 13) * 50;

  this.node.style.top = `${top}px`;
  this.node.style.left = `${left}px`;
  }  
};
