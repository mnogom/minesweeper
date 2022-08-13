const levelsMap = {
  Junior: { width: 8, height: 8, mines: 10 },
  Middle: { width: 16, height: 16, mines: 40 },
  Senior: { width: 30, height: 16, mines: 99 },
  Architect: { width: null, height: null, mines: null },
  _test: { width: 7, height: 5, mines: 6 }, // TODO: REMOVE
};

function getDefaultNames() {
  return Object.keys(levelsMap);
}

function getDefaultWidth(level) {
  return levelsMap[level].width;
}

function getDefaultHeight(level) {
  return levelsMap[level].height;
}

function getDefaultMines(level) {
  return levelsMap[level].mines;
}

export { getDefaultNames, getDefaultWidth, getDefaultHeight, getDefaultMines };
