const colNames = ["a", "b", "c", "d", "e", "f", "g", "h"]

function isFen(maybeFen) {
    pattern = /^([0-9bknpqrBKNPQR]{1,8}\/){7}[0-9bknpqrBKNPQR]{1,8}$/gm

    return pattern.test(maybeFen);
}

function makeFen() {
    const cells = Array.from(document.querySelectorAll(".cell"))

    const fenList = []
    for (let i = 8; i > 0; i--) {
        const rowCells = cells.filter(el => el.id.includes(i.toString()));

        const row = colNames.map(
            c => {
                const cell = rowCells.find(el => el.id.includes(c));
                if (cell) {
                    return cell.getAttribute("data-piece") ?? 1
                }
                return 1;
            }
        );

        let rowString = ""
        let subtotal = 0
        for (let c of row) {
            if (typeof c == "number") {
                subtotal +=1;
            } else {
                if (subtotal !== 0) {
                    rowString += subtotal.toString();
                    subtotal = 0;
                }
                rowString += c;
            }
        }
        if (subtotal !== 0) {
            rowString += subtotal.toString();
        }

        fenList.push(rowString);
    }

    document.getElementById("fen").textContent = fenList.join("/")
}

function parseFen() {
    const fenInput = document.getElementById("fenInput");
    const fenError = document.getElementById("fenError");

    const fenString = fenInput.value;

    if (!isFen(fenString)) {
        fenError.textContent = `${fenString} is not a valid FEN`;
        fenInput.value = "";

        return;
    }

    resetBoard();
    fenError.textContent = "";

    fenString.split("/").forEach((fenLine, index) => {
        const rowIndex = 8-index;
        let colIndex = 0;
        for (const fenChar of fenLine) {
            if (isNaN(parseInt(fenChar))) {
                const id = `${colNames[colIndex]}${rowIndex}`;
                const cell = document.getElementById(id);

                if (cell) {
                    myglobals.piece = fenChar;
                    updateImage(cell);
                }
                colIndex += 1;
            } else {
                colIndex += parseInt(fenChar);
            }
        }
    });

    makeFen()
}

function makeFenLine(symbolLine) {
    let line = "";
    let emptyNum = 0;
    for (const symChar of symbolLine) {
        if (!symChar) {
            emptyNum++;
            return;
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