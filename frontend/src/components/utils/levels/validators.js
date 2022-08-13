import * as yup from "yup";

import { getDefaultNames } from "./default-levels.js"

function validateWidth(width) {
  const schema = yup.number().integer().moreThan(4).lessThan(100);
  return schema.isValid(width);
};

function validateHeight(height) {
  const schema = yup.number().integer().moreThan(4).lessThan(100);
  return schema.isValid(height);
};

function validateMines(width, height, mines) {
  const schema = yup.number().integer().moreThan(0).lessThan(width * height - 9);
  return schema.isValid(mines);
};

function validateName(name) {
  const schema = yup.string().oneOf(getDefaultNames())
  return schema.isValid(name)
};

export {
  validateWidth,
  validateHeight,
  validateMines,
  validateName,
}