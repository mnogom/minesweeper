import { mineValue } from "./constants.js"

function getAddress() {
  return this._address;
}

function getValue() {
  return this._value;
};

function isMine() {
  return this.getValue() === mineValue;
};

function isOpened() {
  return this._opened;
}

function isFlagged() {
  return this._flagged;
};

function isEqual(cell) {
  return this.getAddress() === cell.getAddress();
};

function setValue(value) {
  return new Cell(
    this.getAddress(),
    value,
    this.isOpened(),
    this.isFlagged(),
  );
};

function open() {
  return new Cell(
    this.getAddress(),
    this.getValue(),
    true,
    this.isFlagged(),
  )
};

function placeFlag() {
  return new Cell(
    this.getAddress(),
    this.getValue(),
    this.isOpened(),
    true,
  );
};

function removeFlag() {
  return new Cell(
    this.getAddress(),
    this.getValue(),
    this.isOpened(),
    false,
  );
};

function Cell(address, value = null, opened = false, flagged = false) {
  this._address = address;
  this._value = value;
  this._opened = opened;
  this._flagged = flagged;
  this.getAddress = getAddress;
  this.getValue = getValue;
  this.setValue = setValue;
  this.isMine = isMine;
  this.isOpened = isOpened;
  this.open = open;
  this.isFlagged = isFlagged;
  this.placeFlag = placeFlag;
  this.removeFlag = removeFlag;
  this.isEqual = isEqual;
}

export default Cell;
