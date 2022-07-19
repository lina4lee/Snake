class Head {
  constructor(el) {
    this.board = el; // board on the DOM
    this.node = document.createElement('div');
    this.node.setAttribute('id', 'head');
    el.appendChild(this.node);

    //initialze current direction as null to prevent movement until user provides direction
    this.currentDirection = 'null';
    this.SPEED = 250; // time interval in milliseconds

    //set starting location of the snake head as the top left corner of the board
    this.node.style.top = '0px';
    this.node.style.left = '0px';

    //track the previous positions of the head
    this.headPosition = [];

    //maintain all the non-head body parts
    this.bodyParts = [];

    //start the game
    setTimeout(this.move.bind(this), this.SPEED);
  }

  move() {
    //continue to loop the game
    const timeoutID = setTimeout(this.move.bind(this), this.SPEED);

    const head = this.node;
    const direction = this.currentDirection;

    //determine the top and left positions of the head
    let topPosition = Number(head.style.top.replace('px', ''));
    let leftPosition = Number(head.style.left.replace('px', ''));

    //change direction as the user provides directional input
    switch(direction) {
      case 'left':
        head.style.left = `${(leftPosition -= 50)}px`;
        break;
      case 'right':
        head.style.left = `${(leftPosition += 50)}px`;
        break;
      case 'down':
        head.style.top = `${(topPosition += 50)}px`;
        break;
      case 'up':
        head.style.top = `${(topPosition -= 50)}px`; 
        break; 
    }

    //terminate game if out of bounds
    if (this.headIsOutBounds(topPosition, leftPosition)){
      return this.endGame(timeoutID);
    }
    
    if(this.appleIsEaten(topPosition, leftPosition)){
      //clear current apple
      this.removeApple();
      //generate a new apple
      this.generateApple();
      //generate a new body piece
      this.generateNewBody();
      //increase the speed
      this.SPEED -= 10;
    }

    //enqueue head positions to headPositions array, and ensure it's only one element longer than bodyParts array
    this.trackHeadPositions(topPosition, leftPosition);

    //if any body pieces exist, move them to the next position
    if (this.bodyParts.length > 0){
      this.moveBody(timeoutID);
    }
  }

  headIsOutBounds(topPosition, leftPosition){
    return topPosition >= 700 || topPosition < 0 || leftPosition >= 700 || leftPosition < 0;
  }

  appleIsEaten(topPosition, leftPosition){
    const apple = document.querySelector('#apple').style;

    return (`${topPosition}px` === apple.top && `${leftPosition}px` === apple.left)
  }
  
  removeApple() {
    const apple = document.querySelector('#apple');

    apple.remove();
  }
 
  generateApple(){
    let newApple;
    let appleLocationIsInvalid = true;

    while(appleLocationIsInvalid){
      if(newApple){
        this.removeApple();
      }
      new Apple(this.board);
      newApple = document.querySelector('#apple');

      appleLocationIsInvalid = this.headPosition.some((top, left) =>{
        return (`${top}px` === newApple.style.top && `${left}px` === newApple.style.left)
      });
    }
  }
  generateNewBody(){
    const newBody = new Body(this.board);
    this.bodyParts.push(newBody);
  }

  trackHeadPositions(topPosition, leftPosition){
    //add the current head position to the front of headPositions
    this.headPosition.unshift({top: topPosition, left: leftPosition});

    if(this.headPosition.length > this.bodyParts.length + 1) this.headPosition.pop();
  }

  moveBody(timeoutID){
    //get current head position to determine where to move the body parts
    const {top: headTop, left: headLeft} = this.headPosition[0];

    for (let i = 0; i < this.bodyParts.length; i++){
      const currentBody = this.bodyParts[i].node.style;
      if(`${headTop}px` === currentBody.top && `${headLeft}px` === currentBody.left){
        return this.endGame(timeoutID);
      }

      const {top: newTop, left: newLeft} = this.headPosition[i + 1];
      currentBody.top = `${newTop}px`;
      currentBody.left = `${newLeft}px`;
    }
  }

  endGame(timeoutID){
    clearTimeout(timeoutID);

    confirm('Do you want to play the game again?');

    document.querySelectorAll('.body').forEach(node => node.remove());

    this.currentDirection = 'null';
    this.SPEED = 250;
    this.node.style.top = '0px';
    this.node.style.left = '0px';
    this.headPosition = [];
    this.bodyParts = [];
    this.removeApple();
    this.generateApple();
    this.move();
  }
}
