function tjlSymbolsToFenSymbols(tjlSymbols) {
    return tjlSymbols.map(symbolLine => 
        symbolLine.map(tjlSymbolToFenSymbol)    
    );
}

function tjlSymbolToFenSymbol(tjlSymbolString) {
    switch (tjlSymbolString) {
        case "Qw":
            return "Q";
        case "Qb":
            return "q";
        case "Kw":
            return "K";
        case "Kb":
            return "k";
        case "Rw":
            return "R";
        case "Rb":
            return "r";
        case "Bw":
            return "B";
        case "Bb":
            return "b";
        case "Nw":
            return "N";
        case "Nb":
            return "n";
        case "Pw":
            return "P";
        case "Pb":
            return "p";
        default:
            return null;
    }
}