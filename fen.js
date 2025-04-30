function makeFen() {
    const cells = Array.from(document.querySelectorAll(".cell"))

    const fenList = []
    for (let i = 8; i > 0; i--) {
        const rowCells = cells.filter(el => el.id.includes(i.toString()));

        const row = ["a", "b", "c", "d", "e", "f", "g", "h"].map(
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