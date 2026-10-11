let selected = null;
const points = { white: 0, black: 0 };
let turn = 1;

const row1 = [
    { name: "R", color: "white", points: 5 }, { name: "N", color: "white", points: 3 },
    { name: "B", color: "white", points: 3 }, { name: "Q", color: "white", points: 9 },
    { name: "K", color: "white", points: 0 }, { name: "B", color: "white", points: 3 },
    { name: "N", color: "white", points: 3 }, { name: "R", color: "white", points: 5 },
];
const row2 = [
    { name: "P", color: "white", points: 1 }, { name: "P", color: "white", points: 1 },
    { name: "P", color: "white", points: 1 }, { name: "P", color: "white", points: 1 },
    { name: "P", color: "white", points: 1 }, { name: "P", color: "white", points: 1 },
    { name: "P", color: "white", points: 1 }, { name: "P", color: "white", points: 1 },
];

const row3 = [null, null, null, null, null, null, null, null];
const row4 = [null, null, null, null, null, null, null, null];
const row5 = [null, null, null, null, null, null, null, null];
const row6 = [null, null, null, null, null, null, null, null];

const row7 = [
    { name: "P", color: "black", points: 1 }, { name: "P", color: "black", points: 1 },
    { name: "P", color: "black", points: 1 }, { name: "P", color: "black", points: 1 },
    { name: "P", color: "black", points: 1 }, { name: "P", color: "black", points: 1 },
    { name: "P", color: "black", points: 1 }, { name: "P", color: "black", points: 1 },
];
const row8 = [
    { name: "R", color: "black", points: 5 }, { name: "N", color: "black", points: 3 },
    { name: "B", color: "black", points: 3 }, { name: "Q", color: "black", points: 9 },
    { name: "K", color: "black", points: 0 }, { name: "B", color: "black", points: 3 },
    { name: "N", color: "black", points: 3 }, { name: "R", color: "black", points: 5 },
];

const whereUAt = [row1, row2, row3, row4, row5, row6, row7, row8];

function draw(){
  for (let row = 1; row <= 8; row++){
    for (let col = 1; col <= 8; col++){
      const square = document.getElementById(col + "_" + row); //gets the right div for every box
      const piece = whereUAt [row - 1][col - 1]; //gets the position for for each piece whether it be null or a real one

      if (piece === null) {
        square.innerHTML = ""; //if theres no piece then then it displays nothing
      }
      else {
        square.innerHTML = '<img src="./assets/' + piece.color + "_" + piece.name + '.png">'; //if theres a piece it displays the right image
      }
    }
  }
}

function pathIsClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);

    let r = fromRow + rowStep;
    let c = fromCol + colStep;

    while (r !== toRow || c !== toCol) {
        if (whereUAt[r - 1][c - 1] !== null) {
            return false;
        }
        r += rowStep;
        c += colStep;
    }
    return true;
}
draw();

document.getElementById("game").addEventListener("click", function (event) {
  const square = event.target; //thing that gets clicked is the square
  if (!square.classList.contains("cell")) return; //if theres no square there then nothing happens

  let parts = square.id.split("_"); //splits up the name of the id so i can use it for the row and column
  const row = Number(parts[1]);
  const col = Number(parts[0]);
  const piece = whereUAt[row - 1][col - 1];

  if (selected === null) {
    if (piece !== null) {
      selected = { row: row, col: col }; //selected object to show which piece to move
      square.classList.add("selected");
    }
    return;
  }

  document.getElementById(selected.col + "_" + selected.row).classList.remove("selected");
  if (selected.col === col && selected.row === row) {
    selected = null;
    return;
  }

  const movingPiece = whereUAt[selected.row - 1][selected.col - 1];
  const newPlace = whereUAt[row - 1][ col - 1];
  const rowDiff = Math.abs(row - selected.row);
  const colDiff = Math.abs(col - selected.col);
  let legal;

  if (movingPiece.name === "P") {
    let difference = 1;
    let firstMove = 2;
    if (movingPiece.color === "black") { //makes both sides go the right way
      difference = -1;
      firstMove = -2;
    }

    if (selected.row === 2 && movingPiece.color === "white") {
      legal = (newPlace === null && (colDiff === 0 && row <= selected.row + firstMove && row > 2)); //pawns can move 2 on first move
    }
    else if (selected.row === 7 && movingPiece.color === "black") {
      legal = (newPlace === null && (colDiff === 0 && row >= selected.row + firstMove && row < 7)); //pawns can move 2 on first move

    }
    else {
      legal = (newPlace === null && colDiff === 0 && row === selected.row + difference); //determines that the pawn can only go forward
    }

    let capture = (newPlace !== null) && (colDiff === 1) && (row === selected.row + difference);

    if (!legal && !capture) {
          selected = null;
          return;
      }

    if (!pathIsClear(row, col, selected.row, selected.col)) {
      selected = null;
      return;
    }
  }

  if (movingPiece.name === "B") {
    let legal = (rowDiff >= 1 && colDiff >= 1 && rowDiff === colDiff);
    if (!legal) {
      selected = null;
      return;
    }
    if (!pathIsClear(row, col, selected.row, selected.col)) {
      selected = null;
      return;
    }
  }

  if (movingPiece.name === "N") {
    let legal = ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2));
    if (!legal) {
      selected = null;
      return;
    }
  }

  if (movingPiece.name === "R") {
    let legal = ((rowDiff <= 7 && colDiff === 0) || (rowDiff === 0 && colDiff <= 7));
    if (!legal) {
      selected = null;
      return;
    }
    if (!pathIsClear(row, col, selected.row, selected.col)) {
      selected = null;
      return;
    }
  }

  if (movingPiece.name === "Q") {
    let legal = ((rowDiff <= 7 && colDiff === 0) || (rowDiff === 0 && colDiff <= 7) || (rowDiff === colDiff));
    if (!legal) {
      selected = null;
      return;
    }
    if (!pathIsClear(row, col, selected.row, selected.col)) {
      selected = null;
      return;
    }
  }

  if (movingPiece.name === "K") {
    let legal = ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 1));
    if (!legal) {
      selected = null;
      return;
    }
  }

  if (turn % 2 !== 0 && movingPiece.color === "black") {
    selected = null;
    return;
  }
  else if (turn % 2 === 0 && movingPiece.color === "white") {
    selected = null;
    return;
  }

  if (newPlace?.color === movingPiece.color){
    selected = null;
    return;
  }

  if (newPlace !== null) { //Gives points if theres a capture
    points[movingPiece.color] += newPlace.points;
    console.log(points);
  }

  whereUAt[row - 1][col - 1] = whereUAt[selected.row - 1][selected.col - 1];
  whereUAt[selected.row - 1][selected.col - 1] = null;
  selected = null;
  draw();

  turn += 1;
  if (turn % 2 === 0) {
    document.getElementById("turn").textContent = "It's black's turn!";
  } else {
    document.getElementById("turn").textContent = "It's white's turn!";
  }
});
