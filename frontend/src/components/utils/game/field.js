import _ from "lodash";

import Cell from "./cell.js";
import { shuffle, contains, not } from "./utils.js";
import { mineValue, statuses } from "./constants.js";

function toString() {
  const cells = this.getCells();
  const width = this.getLevel().getWidth();
  const rows = _.chunk(cells, width);
  return rows.map((row) => (
    [
      row.map((cell) => {
        const address = String(cell.getAddress());
        return address.length === 1 ? ` ${address}` : address;
      }).join(" "),
      row.map((cell) => cell.getValue() === mineValue ? "*" : cell.getValue()).join(" "),
      row.map((cell) => {
        if (cell.isOpened()) {
          switch (cell.getValue()) {
            case 0:
              return 0;
            case mineValue:
              return "*";
            default:
              return cell.getValue();
          }
        }
        if (cell.isFlagged()) return "F";
        return "█"
      }).join(" "),
    ].join("   |   ")
  )).join("\n")
}

function getLevel() {
  return this._level;
}

function getCellX(cell) {
  return Math.floor(cell.getAddress() / this.getLevel().getWidth());
}

function getCellY(cell) {
  return cell.getAddress() % this.getLevel().getWidth();
}

function getCells() {
  return this._cells;
}

function setCells(cells) {
  return new Field(this.getLevel(), cells);
}

function areNeighbors(cell1, cell2) {
  if (cell1.isEqual(cell2)) {
    return false;
  }
  const x1 = getCellX.call(this, cell1);
  const y1 = getCellY.call(this, cell1);
  const x2 = getCellX.call(this, cell2);
  const y2 = getCellY.call(this, cell2);
  return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
}

function getNeighbors(cell) {
  return this.getCells().filter((_cell) => this.areNeighbors(cell, _cell));
}

function getCellByAddress(address) {
  const cell = this.getCells()[address];
  return new Cell(
    cell.getAddress(),
    cell.getValue(),
    cell.isOpened(),
    cell.isFlagged()
  );
}

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
}

function makeEmptyCells(level) {
  const addresses = generateAdresses(level.getWidth(), level.getHeight());
  return addresses.map((address) => new Cell(address));
}

function touch(cell) {
  // statused function ------------------------
  if (this.getStatus() === statuses.notStarted) {
    const field = _firstTouch.call(this, cell);
    const updatedCell = field.getCellByAddress(cell.getAddress());
    return _casualTouch.call(field, updatedCell);
  }
  if (this.getStatus() === statuses.started) {
    if (not(cell.isOpened())) {
      return _casualTouch.call(this, cell);
    }
    return _advanceTouch.call(this, cell);
  }
  return this
}

function _firstTouch(initCell) {
  const minesCount = this.getLevel().getMines();
  let cells = this.getCells();

  let unknownCells = cells.filter((cell) => {
    const isInitCell = initCell.isEqual(cell);
    const isNeighborInitCell = this.areNeighbors(initCell, cell);
    return not(isInitCell || isNeighborInitCell);
  });
  unknownCells = shuffle(unknownCells);
  let mineCells = unknownCells.slice(0, minesCount);

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
      const neighborsCells = cells.filter((_cell) =>
        this.areNeighbors(cell, _cell)
      );
      const minesAround = neighborsCells.filter((cell) => cell.isMine()).length;
      return cell.setValue(minesAround);
    }
    return cell;
  });

  return this.setCells(cells);
}

function _casualTouch(cellToOpen) {
  const flaggedCells = [];
  const openedCells = [];
  const cellsToOpen = [cellToOpen];
  let cells = this.getCells();

  if (cellToOpen.isMine() && not(cellToOpen.isFlagged())) {
    // Loose condition
    return showMines.call(this)
  }

  while (cellsToOpen.length > 0) {
    const cell = cellsToOpen.pop();

    if (cell.isFlagged()) {
      flaggedCells.push(cell);
      continue;
    }

    // Check if cell is in opened cells
    openedCells.push(cell);
    cells = cells.map((_cell) => (_cell.isEqual(cell) ? _cell.open() : _cell));

    if (cell.getValue() === 0) {
      const neighborsCells = this.getNeighbors(cell);
      for (const neighbor of neighborsCells) {
        if (
          not(
            contains(
              [...openedCells, ...cellsToOpen, ...flaggedCells],
              neighbor
            )
          )
        ) {
          cellsToOpen.push(neighbor);
        }
      }
    }
  }

  return this.setCells(cells);
}

function _advanceTouch(cellToOpen) {
  const cell = cellToOpen;
  const neighbors = this.getNeighbors(cell);
  const countOfFlagsAround = neighbors.filter((_cell) =>
    _cell.isFlagged()
  ).length;
  if (cell.getValue() === countOfFlagsAround) {
    let field = this;
    for (const _cell of neighbors) {
      field = _casualTouch.call(field, _cell);
    }
    return field;
  }
  return this;
}

function toggleFlag(cellToFlag) {
  // statused function ------------------------
  if (this.getStatus() !== statuses.started) {
    return this;
  }
  if (cellToFlag.isOpened()) {
    return this;
  }
  const cells = this.getCells().map((cell) => {
    if (cell.isEqual(cellToFlag)) {
      return cell.isFlagged() ? cell.removeFlag() : cell.placeFlag();
    }
    return cell;
  });
  return this.setCells(cells);
}

function showMines() {
  const cells = this.getCells()
    .map((cell) => cell.isMine() ? cell.open() : cell);
  return this.setCells(cells)
}

function isFieldEmpty() {
  return (
    this.getCells().filter((cell) => cell.getValue() !== null).length === 0
  );
}

function areMinesOpened() {
  return this.getCells().filter((cell) => cell.isMine() && cell.isOpened()).length !== 0
}

function areAllCellsAreOpened() {
  const level = this.getLevel()
  const width = level.getWidth();
  const height = level.getHeight();
  const mines = level.getMines();
  return this.getCells().filter((cell) => not(cell.isMine()) && cell.isOpened()).length === width * height - mines;
}

function getStatus() {
  if (isFieldEmpty.call(this)) {
    return statuses.notStarted;
  }
  if (areMinesOpened.call(this)) {
    return statuses.loosed;
  }
  if (areAllCellsAreOpened.call(this)) {
    return statuses.winned;
  }
  return statuses.started;
}

function Field(level, cells) {
  this._level = level;
  this._cells = cells ? cells : makeEmptyCells(level);
  this.getLevel = getLevel;
  this.areNeighbors = areNeighbors;
  this.getNeighbors = getNeighbors;
  this.getCellByAddress = getCellByAddress;
  this.getCells = getCells;
  this.setCells = setCells;
  this.isFieldEmpty = isFieldEmpty;
  this.getStatus = getStatus;
  this.touch = touch;
  this.toggleFlag = toggleFlag;
  this.toString = toString;
}

export default Field;


import Level from "../levels/level.js";

const lvl = new Level("_test");
let field = new Field(lvl);

console.log(field.getStatus());
const values = [0, 1, 1, 1, 1, 1, 1, 0, 2, -1, 3, 2, -1, 1, 0, 2, -1, -1, 2, 1, 1, 0, 2, 3, 3, 2, 1, 1, 0, 1, -1, 1, 1, -1, 1];
field = field.setCells(
  field.getCells().map((cell, i) => cell.setValue(values[i]))
);

const testTouch = (field, address) => {
  const touchedCell = field.getCellByAddress(address);
  const _field = field.touch(touchedCell);
  console.log(`Status: ${_field.getStatus()} // Touched ${address}`);
  console.log(String(_field));
  console.log('-'.repeat(20));
  return _field;
};

field = testTouch(field, 0);
field = field.toggleFlag(field.getCellByAddress(33));
field = testTouch(field, 34);
field = testTouch(field, 34);

