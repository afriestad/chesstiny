function getTopConstraint(board, y, x) {
    if (y === 0) {
        return "RRRRRRRR";
    }

    const overId = board[y-1][x];

    if (!overId) return undefined;

    return myglobals.intermediateData[overId].bottom;
}

function getBottomConstraint(board, y, x) {
    if (y === 63) {
        return "RRRRRRRR";
    }

    const overId = board[y+1][x];

    if (!overId) return undefined;

    return myglobals.intermediateData[overId].top;
}

function getLeftConstraint(board, y, x) {
    if (x === 0) {
        return "RRRRRRRR";
    }

    const overId = board[y][x-1];

    if (!overId) return undefined;

    return myglobals.intermediateData[overId].right;
}

function getRightConstraint(board, y, x) {
    if (x === 63) {
        return "RRRRRRRR";
    }

    const overId = board[y][x+1];

    if (!overId) return undefined;

    return myglobals.intermediateData[overId].left;
}

function getConstraints(board, y, x) {
    const topConstraint = getTopConstraint(board, y, x);
    const bottomConstraint = getBottomConstraint(board, y, x);
    const leftConstraint = getLeftConstraint(board, y, x);
    const rightConstraint = getRightConstraint(board, y, x);

    return {leftConstraint, rightConstraint, topConstraint, bottomConstraint};
}

function performBoardIteration(board, cellIds, undecidedIndices = []) {
    const placedIds = [];
    for (let y = 0; y < 64; y++) {
        for (let x = 0; x < 64; x++) {
            if (board[y][x] !== null) continue;

            const {topConstraint, leftConstraint, bottomConstraint, rightConstraint} = getConstraints(board, y, x);

            let possibilities = [...cellIds];
            if (topConstraint) {
                possibilities = possibilities.filter(id => {
                    const cell = myglobals.intermediateData[id];
                    return cell.top === topConstraint;
                })
            }

            if (leftConstraint) {
                possibilities = possibilities.filter(id => {
                    const cell = myglobals.intermediateData[id];
                    return cell.left === leftConstraint;
                })
            }

            if (bottomConstraint) {
                possibilities = possibilities.filter(id => {
                    const cell = myglobals.intermediateData[id];
                    return cell.bottom === bottomConstraint;
                })
            }

            if (rightConstraint) {
                possibilities = possibilities.filter(id => {
                    const cell = myglobals.intermediateData[id];
                    return cell.right === rightConstraint;
                })
            }

            if (possibilities.length > 1 && 
                (topConstraint || leftConstraint || rightConstraint || bottomConstraint)
                ) {
                undecidedIndices.push([y, x]);
            }

            if (possibilities.length === 1) {
                board[y][x] = possibilities[0];
                placedIds.push(possibilities[0]);
            }
        }
    }

    return {undecidedIndices, placedIds};
}

function buildBoard() {
    const board = Array.from(Array(64)).map(e => Array(64).fill(null));
    
    let cellIds = Object.keys(myglobals.intermediateData);
    let recheck = [];

    for (let boardIterations = 0; boardIterations < 50; boardIterations++) {
        const {undecidedIndices, placedIds} = performBoardIteration(board, cellIds, recheck);
        cellIds = cellIds.filter(id => !placedIds.includes(id));
        recheck = undecidedIndices;

        if (recheck.length === 0) {
            console.log("We have nowhere else to check");
            break;
        };

        if (cellIds.length === 0) {
            console.log("We have run out of pieces to place in", boardIterations, "iterations!");
            break;
        }

        if (placedIds.length === 0) {
            console.log("We seem to be unable to place any more pieces after", boardIterations, "iterations");
            break;
        }
    }

    
    if (cellIds.length) {
        const unusedFreqs = cellIds.map(id => myglobals.intermediateData[id].sequence);
        document.getElementById("unused-freqs").textContent = "[" + unusedFreqs.join(", ") + "]";
    }

    const allFreqs = Object.keys(myglobals.indices.sequence).map(e => parseInt(e));
    const missingFreqs = [];
    for (let i = 1; i <= 64*64; i++) {
        if (!allFreqs.includes(i)) missingFreqs.push(i);
    }
    document.getElementById("missing-freqs").textContent = "[" + missingFreqs.join(", ") + "]";

    const qrBoard = board.slice(24, 40).map(row => row.slice(24, 40));

    return [board, qrBoard, ...cellIds.map(id => [[id]])];
}
