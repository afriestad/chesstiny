function isFen(maybeFen) {
    const pattern = /^(?:[0-9bknpqrBKNPQR]{1,8}\/){7}[0-9bknpqrBKNPQR]{1,8}$/

    return pattern.test(maybeFen);
}

function isLefen(maybeLefen) {
    const pattern = /^(?:[0-9bknpqrBKNPQR]{1,8}\/){8}[GgRr]\/(?:-1|[0-9a-f]{4})$/

    return pattern.test(maybeLefen);
}

function isLeon(maybeLeon) {
    const pattern = /^(?:[0-9bknpqrBKNPQR]{1,8}\/){4}[0-9bknpqrBKNPQR]\/[GgRr]\/(?:-1|[0-9a-f]{4})$/

    return pattern.test(maybeLeon);
}

function readFenArrayFromCells(cells) {
    const fenArray = []
    for (let i = 8; i > 0; i--) {
        const rowCells = cells.filter(el => el.id.includes(i.toString()));

        const row = myglobals.COL_NAMES.map(
            c => {
                const cell = rowCells.find(el => el.id.includes(c));
                if (cell) {
                    return cell.getAttribute("data-piece") ?? null
                }
                return null;
            }
        );

        fenArray.push(row);
    }
    return fenArray;
}

function readQRFromCells(cells) {
    let qrBinaryString = "";
    for (let row = 0; row < 4; row++) {
        for (let col = 3; col >= 0; col--) {
            const cell = cells.find(el => el.id === `b${col}${row}`);
            if (cell.classList.contains("black")) {
                qrBinaryString += "0";
            } else {
                qrBinaryString += "1";
            }
        }
    }

    return parseInt(qrBinaryString, 2).toString(16);
}

function makeFenFromArray(fenArray) {
    const fen = fenArray.map(fenRow => makeFenLine(fenRow)).join("/")
    
    return fen;
}

function makeLefenFromArray(fenArray, colour, qrCode) {
    const lefen = `${makeFenFromArray(fenArray)}/${colour}/${qrCode}`;

    return lefen;
}

function makeLeonFromArray(fenArray, colour, qrCode) {
    const {top, right, bottom, left} = parseSides(fenArray);

    const centre = fenArray[3][3] ?? "1";

    return `${top}/${right}/${bottom}/${left}/${centre}/${colour}/${qrCode}`;
}

function makeArrayFromFen(fenString) {
    const fenArray = [];
    for (const fenLine of fenString.split("/")) {
        const fenRow = [];

        for (const fenChar of fenLine) {
            if (isNaN(parseInt(fenChar))) {
                fenRow.push(fenChar);
            } else {
                for (let i = 0; i < parseInt(fenChar); i++) {
                    fenRow.push(null);
                }
            }
        }

        fenArray.push(fenRow);
    }

    return fenArray;
}

function parseLefen(lefenString) {
    const lefenArray = lefenString.split("/");

    const fenArray = makeArrayFromFen(lefenArray.slice(0, 8).join("/"));

    return {
        fenArray,
        colour: lefenArray[8],
        qrString: lefenArray[9]
    };
}

function makeFenArrayFromLeonBoard(leonBoardArray) {
    const [top, right, bottom, left, [centre]] = makeArrayFromFen(leonBoardArray);

    const fenArray = [top];
    for (let i = 1; i < 7; i++) {
        const fenRow = Array(8).fill(null);
        
        if (i === 3 || i === 4) {
            fenRow[3] = centre;
            fenRow[4] = centre;
        }

        fenRow[0] = left[i]
        fenRow[7] = right[i];

        fenArray.push(fenRow);
    }
    fenArray.push(bottom);

    console.log(fenArray);
    return fenArray;
}

function parseLeon(leonString) {
    const leonArray = leonString.split("/");

    const fenArray = makeFenArrayFromLeonBoard(leonArray.slice(0, 5).join("/"))

    return {
        fenArray,
        colour: leonArray[5],
        qrString: leonArray[6]
    };
}

function makeFenLine(symbolLine) {
    let line = "";
    let emptyNum = 0;
    for (const symChar of symbolLine) {
        if (!symChar) {
            emptyNum++;
            continue;
        }

        if (emptyNum) {
            line += emptyNum.toString();
            emptyNum = 0;
        }

        line += symChar;
    }

    if (emptyNum !== 0) {
        line += emptyNum.toString();
    }

    return line;
}

function getColumn(symbols, colIndex) {
    return symbols.map(symbolLine => symbolLine[colIndex]);
}

function parseSides(symbols) {
    if (!symbols) return {
        top: "8",
        bottom: "8",
        left: "8",
        right: "8",
    }

    return {
        top: makeFenLine(symbols[0]),
        bottom: makeFenLine(symbols[symbols.length - 1]),
        left: makeFenLine(getColumn(symbols, 0)),
        right: makeFenLine(getColumn(symbols, symbols.length - 1)),
    }
}