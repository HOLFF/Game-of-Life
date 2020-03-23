/*
For creation of this the p5.js library was used
used template: https://p5js.org/examples/simulate-game-of-life.html
Author of this version: Erharter Leonhard
*/

let w;
let columns;
let rows;
let board;
let next;
let state;
let input;
let canv;
let stopbut;
let runbut;
let contbut;
let fillbut;
let info;

function setup() {

  //creating the canvas where the cells will be drawn
  canv = createCanvas(screen.width/2, screen.height/2);
  canv.position(screen.width/4,0);
  //stopping the drawing when mouse is hovering over canvas
  canv.mouseOver(stop);
  //continue if mouse leaves canvas
  canv.mouseOut(cont);

  //w is the width of one single cell in pixels
  w=10;

  //creating a dom element to show text to the player because text() only works inside a canvas
  info = createElement('p','Input percentage of alive cells');
  info.position(65,-3);

  //creating an number input element with default value 50
  input = createInput('50','number');
  input.position(10, 10);
  input.size(50);
  
  //creating button elements for stop,run,continue and fill all
  runbut = createButton('Run');
  runbut.position(10,40);
  runbut.mousePressed(init);

  stopbut = createButton('Stop');
  stopbut.position(10,70);
  stopbut.mousePressed(stop);

  contbut = createButton('Continue');
  contbut.position(10,100);
  contbut.mousePressed(cont);

  fillbut = createButton('Fill all cells living')
  fillbut.position(10,130);
  fillbut.mousePressed(full);

  // Calculate columns and rows using canvas size and predefined w
  columns = floor(width / w);
  rows = floor(height / w);

  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }

  // Going to use two 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
}

function draw() {
  //drawing the cells inside of the canvas

  background(255);
  if(state==1);         //stopping the script form generating the next gen if the stop button is active
  else generate();      //if not active generate the next button
  
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      if ((board[i][j] == 1)) fill(0);
      else fill(255);
      stroke(0);
      rect(i * w, j * w, w-1, w-1);
    }
  }

}


function init() {
  //filling the board using a userchosen factor between living and dead cells(fillfact)
  let fillfact=input.value();
  //start the programm by setting state to 0
  state=0;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s because they mess with the simulation due to only having 5 adjacent cells     
      let ran = floor(random(101));
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) board[i][j] = 0;
      // Filling the rest randomly with a percentage between living and dead
      else if (ran<=fillfact) board[i][j]=1;
      else board[i][j] = 0;
      next[i][j] = 0;
      
    }
  }
}

function full() {
  //filling every cell as alive, even border ones to generate a nice visual effect
  state=0;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j]=1;
      next[i][j] = 0;
      
    }
  }
}

function generate() {
  //generating the new generation on the board that will be switched to next
  // Loop through every spot in our 2D array and check spots neighbors
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid including the cells own state
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];
      // Rules of Life
      if      ((board[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;           // Loneliness
      else if ((board[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;           // Overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;           // Reproduction
      else                                             next[x][y] = board[x][y]; // Stasis
    }
  }

  // Swap the board that is drawn

    let temp = board;
    board = next;
    next = temp;
  

}

function stop(){
  //changing state and so blocking the script from generating the new generation
    state =1;
}

function cont(){
  //changing state so script can continue on
    state =0;
}
