export const getNewCellPrimeToggled = (cells, pos) => {
    const newCells = cells.slice();
    const cell = newCells[pos];
    const newCell = {
        ...cell,
        isPrime: true
    };
    newCells[pos] = newCell;
    return newCells;
};

export const getNewCellVisitingToggled = (cells, pos) => {
    const newCells = cells.slice();
    const cell = newCells[pos];
    const newCell = {
        ...cell,
        isVisiting: !cell.isVisiting
    };
    newCells[pos] = newCell;
    return newCells;
};

export const getNewCellCheckToggled = (cells, pos) => {
    const newCells = cells.slice();
    const cell = newCells[pos];
    const newCell = {
        ...cell,
        isChecking: true
    };
    newCells[pos] = newCell;
    return newCells;
};

export const getCells = (rows) => {
    const cells = [];
    for (let cell = 1; cell <= rows; cell++) {
        cells.push(createCell(cell));
    }
    return cells;
};

export const createCell = (val) => {
    return {
        val,
        isChecking: false,
        isVisiting: false,
        isPrime: false
    };
};
