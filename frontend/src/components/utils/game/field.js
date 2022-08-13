import _ from "lodash";

import Cell from "./cell.js";
import { shuffle, contains, not } from "./utils.js";
import { mineValue } from "./constants.js"

function toString() {
  const cells = this.getCells();
  const width = this.getLevel().getWidth();
  const rows = _.chunk(cells, width);

  let result = `\n${"=".repeat(2 * width - 1)}\n`;
  result = result += rows.map((row) => {
    return row.map((cell) => {
      return cell.getValue() === mineValue ? "*" : cell.getValue();
    }).join(" ");
  }).join("\n");

  result = result += `\n${"=".repeat(2 * width - 1)}\n`;

  result += rows.map((row) => {
    return row.map((cell) => {
      if (cell.isOpened()) {
        return cell.getValue() === 0 ? " " : cell.getValue();
      }
      if (cell.isFlagged()) {
        return "F";
      }
      return "█";
    }).join(" ");
  }).join("\n");
  result = result += `\n${"=".repeat(2 * width - 1)}\n`;
  return result;
};

function getLevel() {
  return this._level;
};

function getX(cell) {
  return Math.floor(cell.getAddress() / this.getLevel().getWidth());
};

function getY(cell) {
  return cell.getAddress() % this.getLevel().getWidth()
};

function getCells() {
  return this._cells;
};

function isEmpty() {
  return this.getCells().filter((cell) => cell.getValue() !== null).length === 0
};

function setCells(cells) {
  return new Field(
    this.getLevel(),
    cells,
  );
};

function areNeighbors(cell1, cell2) {
  if (cell1.isEqual(cell2)) {
    return false;
  }
  const x1 = this.getX(cell1);
  const y1 = this.getY(cell1);
  const x2 = this.getX(cell2);
  const y2 = this.getY(cell2);
  return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
};

function getNeighbors(cell) {
  return this.getCells().filter((_cell) => this.areNeighbors(cell, _cell));
};

function getCellByAddress(address) {
  const cell = this.getCells()[address]
  return new Cell(
    cell.getAddress(),
    cell.getValue(),
    cell.isOpened(),
    cell.isFlagged(),
  );
};

function generateAdresses(width, height) {
  let curAddress;
  const addresses = [];
  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      curAddress = curAddress === undefined ? 0 : curAddress + 1;
      addresses.push(curAddress);
    }
  }
  return addresses;
};

function makeEmptyCells(level) {
  const addresses = generateAdresses(level.getWidth(), level.getHeight());
  return addresses.map((address) => new Cell(address));
};

function touch(cell) {
  if (this.isEmpty()) {
    const field = _firstTouch.call(this, cell)
    const updatedCell = field.getCellByAddress(cell.getAddress());
    return _casualTouch.call(field, updatedCell);
  }
  if (not(cell.isOpened())) {
    return _casualTouch.call(this, cell);
  }
  return _advanceTouch.call(this, cell)
};

function _firstTouch(initCell) {
  const minesCount = this.getLevel().getMines()
  let cells = this.getCells();

  // Make safe island around initial cell (initial cell value is always 0)
  let [safeCells, unknownCells] = _.partition(cells, (cell) => {
    const isInitCell = initCell.isEqual(cell);
    const isNeighborInitCell = this.areNeighbors(initCell, cell);
    return isInitCell || isNeighborInitCell;
  });
  unknownCells = shuffle(unknownCells);
  let mineCells = unknownCells.slice(0, minesCount);
  safeCells = [...safeCells, ...unknownCells.slice(minesCount)];

  // Fill cells with mines
  cells = cells.map((cell) => {
    for (const mineCell of mineCells) {
      if (cell.isEqual(mineCell)) {
        return cell.setValue(mineValue);
      }
    }
    return cell;
  });

  // Fill cells with values
  cells = cells.map((cell) => {
    if (not(cell.isMine())) {
      const neighborsCells = cells.filter((_cell) => this.areNeighbors(cell, _cell));
      const minesAround = neighborsCells.filter((cell) => cell.isMine()).length;
      return cell.setValue(minesAround);
    }
    return cell;
  });

  return this.setCells(cells);
};

function _casualTouch(cellToOpen) {
  const flaggedCells = [];
  const openedCells = [];
  const cellsToOpen = [cellToOpen]
  let cells = this.getCells()

  while(cellsToOpen.length > 0) {
    const cell = cellsToOpen.pop()

    if (cell.isFlagged()) {
      flaggedCells.push(cell);
      continue;
    }

    // Check if cell is in opened cells
    openedCells.push(cell)
    cells = cells.map((_cell) => _cell.isEqual(cell) ? _cell.open() : _cell)

    if (cell.getValue() === 0) {
      const neighborsCells = this.getNeighbors(cell);
      for (const neighbor of neighborsCells) {
        if (not(contains([...openedCells, ...cellsToOpen, ...flaggedCells], neighbor))) {
          cellsToOpen.push(neighbor);
        }
      }
    };
  };

  return this.setCells(cells);
};

function _advanceTouch(cellToOpen) {
  const cell = cellToOpen;
  const neighbors = this.getNeighbors(cell);
  const countOfFlagsAround = neighbors.filter((_cell) => _cell.isFlagged()).length;
  if (cell.getValue() === countOfFlagsAround) {
    let field = this;
    for (const _cell of neighbors) {
      field = _casualTouch.call(field, _cell);
    }
    return field;
  }
  return this;
};

function toggleFlag(cellToFlag) {
  if (this.isEmpty()) {
    return this;
  }
  if (cellToFlag.isOpened()) {
    return this;
  }
  const cells = this.getCells().map((cell) => {
    if (cell.isEqual(cellToFlag)) {
      return cell.isFlagged() ? cell.removeFlag() : cell.placeFlag();
    }
    return cell
  });
  return this.setCells(cells);
};

function Field(level, cells) {
  this._level = level;
  this._cells = cells ? cells : makeEmptyCells(level);
  this.getLevel = getLevel;
  this.getX = getX;
  this.getY = getY;
  this.areNeighbors = areNeighbors;
  this.getNeighbors = getNeighbors;
  this.getCellByAddress = getCellByAddress;
  this.getCells = getCells;
  this.setCells = setCells;
  this.isEmpty = isEmpty;
  this.touch = touch;
  this.toggleFlag = toggleFlag;
  this.toString = toString;
};









// ---------------
import Level from "../levels/level.js";
const level = new Level("_test");

console.log("--- INIT FIELD ---");
let field = new Field(level);
console.log(`Level: ${field.getLevel()}`);
console.log(`Is empty: ${field.isEmpty()}`);

const values = [1, 1, 0, 0, 1, 1, 1, -1, 3, 1, 1, 1, -1, 1, -1, 4, -1, 2, 1, 1, 1, 1, 4, -1, 3, 0, 0, 0, 0, 2, -1, 2, 0, 0, 0];
field = field.setCells(
  field.getCells().map((cell, i) => cell.setValue(values[i]))
)
console.log(String(field))

console.log("open 2")
field = field.touch(field.getCellByAddress(2))
console.log(String(field))

console.log("flag 2")
field = field.toggleFlag(field.getCellByAddress(2))
console.log(String(field))

console.log("flag 34")
field = field.toggleFlag(field.getCellByAddress(34))
console.log(String(field))

console.log("touch 33")
field = field.touch(field.getCellByAddress(33))
console.log(String(field))

console.log("unflag 34")
field = field.toggleFlag(field.getCellByAddress(34))
console.log(String(field))

console.log("touch 34")
console.log(field.getCellByAddress(34).isOpened())
field = field.touch(field.getCellByAddress(34))
console.log(String(field))

console.log("flag 12")
field = field.toggleFlag(field.getCellByAddress(12))
console.log(String(field))

console.log("touch 5")
field = field.touch(field.getCellByAddress(5))
console.log(String(field))

console.log("touch 5")
field = field.touch(field.getCellByAddress(5))
console.log(String(field))