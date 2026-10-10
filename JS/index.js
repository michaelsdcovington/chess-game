let selected = null;

const row1 = [
    { name: "R", color: "white" }, { name: "N", color: "white" },
    { name: "B", color: "white" }, { name: "Q", color: "white" },
    { name: "K", color: "white" }, { name: "B", color: "white" },
    { name: "N", color: "white" }, { name: "R", color: "white" },
];
const row2 = [
    { name: "P", color: "white" }, { name: "P", color: "white" },
    { name: "P", color: "white" }, { name: "P", color: "white" },
    { name: "P", color: "white" }, { name: "P", color: "white" },
    { name: "P", color: "white" }, { name: "P", color: "white" },
];

const row3 = [null, null, null, null, null, null, null, null];
const row4 = [null, null, null, null, null, null, null, null];
const row5 = [null, null, null, null, null, null, null, null];
const row6 = [null, null, null, null, null, null, null, null];

const row7 = [
    { name: "P", color: "black" }, { name: "P", color: "black" },
    { name: "P", color: "black" }, { name: "P", color: "black" },
    { name: "P", color: "black" }, { name: "P", color: "black" },
    { name: "P", color: "black" }, { name: "P", color: "black" },
];
const row8 = [
    { name: "R", color: "black" }, { name: "N", color: "black" },
    { name: "B", color: "black" }, { name: "Q", color: "black" },
    { name: "K", color: "black" }, { name: "B", color: "black" },
    { name: "N", color: "black" }, { name: "R", color: "black" },
];

const whereUAt = [row1, row2, row3, row4, row5, row6, row7, row8];

function draw(){
  for (let row = 1; row <= 8; row++){
    for (let col = 1; col <= 8; col++){
      const square = document.getElementById(col + "_" + row);
      const piece = whereUAt [row - 1][col - 1];

      if (piece === null) {
        square.innerHTML = "";
      }
      else {
        square.innerHTML = '<img src="./assets/' + piece.color + "_" + piece.name + '.png">';
      }
    }
  }
}
draw();

document.getElementById("game").addEventListener("click", function (event) {
  const square = event.target;
  if (!square.classList.contains("cell")) return;

  let parts = square.id.split("_");
  const row = Number(parts[1]);
  const col = Number(parts[0]);
  const piece = whereUAt[row - 1][col - 1];

  if (selected === null) {
    if (piece !== null) {
      selected = { row: row, col: col };
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

  const rowDiff = Math.abs(row - selected.row);
  const colDiff = Math.abs(col - selected.col);

  if (movingPiece.name === "P") {
      let direction = 1;
      if (movingPiece.color === "black") {
          direction = -1;
      }

      if (col !== selected.col || row !== selected.row + direction || piece !== null) {
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
  }

  if (movingPiece.name === "Q") {
    let legal = ((rowDiff <= 7 && colDiff === 0) || (rowDiff === 0 && colDiff <= 7) || (rowDiff === colDiff));
    if (!legal) {
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

  whereUAt[row - 1][col - 1] = whereUAt[selected.row - 1][selected.col - 1];
  whereUAt[selected.row - 1][selected.col - 1] = null;
  selected = null;
  draw();
});
