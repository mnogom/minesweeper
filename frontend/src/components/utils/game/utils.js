import _ from "lodash";

/**
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * @param {*} array 
 */
const shuffle = (array) => {
  const _array = array
  for (let i = _array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = _array[i];
    _array[i] = _array[j];
    _array[j] = temp;
  }
  return _array;
};

const contains = (cellArray, cell) => {
  return _.some(cellArray, (_cell) => cell.isEqual(_cell));
};

const not = (bool) => !bool;

export {
  shuffle,
  contains,
  not,
};