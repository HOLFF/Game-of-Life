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

  canv = createCanvas(screen.width/2, screen.height/2);
  canv.position(screen.width/4,0);
  w=10;

  info = createElement('p','Input percentage of alive cells');
  info.position(65,-3);

  input = createInput();
  input.position(10, 10);
  input.size(50);
  
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

  // Calculate columns and rows
  columns = floor(width / w);
  rows = floor(height / w);
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
}

function draw() {

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

// Fill board randomly
function init() {
  let fillfact=input.value();
  state=0;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s      
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
  state=0;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j]=1;
      next[i][j] = 0;
      
    }
  }
}

// The process of creating the new generation
function generate() {

  // Loop through every spot in our 2D array and check spots neighbors
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
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

  // Swap!

    let temp = board;
    board = next;
    next = temp;
  

}

function stop(){
    state =1;
}

function cont(){
    state =0;
}
