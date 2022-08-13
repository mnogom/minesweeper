import {
  getDefaultWidth,
  getDefaultHeight,
  getDefaultMines,
} from "./default-levels.js";

function getName() {
  return this._name;
}

function setName(name, width = null, height = null, mines = null) {
  return new Name(
    name,
    width ? width : this.getWidth(),
    height ? height : this.getHeight(),
    mines ? mines : this.getMines()
  );
}

function getWidth() {
  return this._width;
}

function setWidth(width) {
  return new Name(this.getName(), width, this.getHeight(), this.getMines());
}

function getHeight() {
  return this._height;
}

function setHeight(height) {
  return new Name(this.getName(), this.getWidth(), height, this.getMines());
}

function getMines() {
  return this._mines;
}

function setMines(mines) {
  return new Name(this.getName(), this.getWidth(), this.getHeight(), mines);
}

function isEqual(level) {
  const isEqualWidth = this.getWidth() === level.getWidth();
  const isEqualHeight = this.getHeight() === level.getHeight();
  const isEqualMines = this.getMines() === level.getMines();
  return isEqualWidth && isEqualHeight && isEqualMines;
}

function isStandartType() {
  return this.getName() !== "Architect";
}

function Name(name, width = null, height = null, mines = null) {
  const _name = name;
  const _width = name === "Architect" ? width : getDefaultWidth(name);
  const _height = name === "Architect" ? height : getDefaultHeight(name);
  const _mines = name === "Architect" ? mines : getDefaultMines(name);

  if (Boolean(_width && _height && _mines) === false) {
    throw new Error("Require width, height, mines parameters");
  }

  this._name = _name;
  this._width = _width;
  this._height = _height;
  this._mines = _mines;
  this.getName = getName;
  this.setName = setName;
  this.getWidth = getWidth;
  this.setWidth = setWidth;
  this.getHeight = getHeight;
  this.setHeight = setHeight;
  this.getMines = getMines;
  this.setMines = setMines;
  this.isStandartType = isStandartType;
  this.isEqual = isEqual;
}

export default Name;
