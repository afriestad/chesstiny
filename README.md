# Queen's Gambit ARG Tools (chesstiny <3)

Here are some of the tools I made to help out during the Destiny 2 Queen's Gambit ARG/Puzzle. All the code is provided under the Unlicence - but none of the images. You'll need to get permission if you want to use those, because they're not mine to licence. If you don't have permission, and you want to use the visualisations from this code base, just swap the images out for something else first.

Mega Board Assembling Engine: https://afriestad.github.io/chesstiny/board-matcher.html

Board-FEN++ Converter (both ways): https://afriestad.github.io/chesstiny/index.html

## What are these notation thingies?

### FEN — Forsyth–Edwards Notation

FEN is a notation for encoding a full chess board state. We only use the part that describes the board's layout. It uses the letters `B`, `K`, `N`, `P`, `Q` and `R` to represent respectively the Bishop, King, kNight (since the K is taken), Pawn, Queen and Rook. White pieces are written uppercase and black pieces in lowercase. Stretches of empty board are summarised as numbers. The lines are written from the white player's perspective, such that for instance a line containing only a single black pawn on the E column would be represented as `4p3`, and two white rooks standing on G and H `6RR`. Each line is then delimited with a `/`. The lines are counted in a reading direction for the player of the white pieces, i.e. with row 8 first and row 1 last. The FEN board code for a starting position is `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR`. 

There's a little bit more to it, but this is the part we use. The rest encodes a bunch of data necessary to keep track of the rules and availability of moves. You can read more about that [on Wikipedia](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation), if you're interested.

### LEFEN — Lemons' Extended Forsyth–Edwards Notation

I made this mostly for myself in the finishing validation and 100% board-building efforts, as I didn't have the tool ready enough before we found enough of the solution. It is based on the FEN format, but adds another two fields at the end to encode the board background colour and QR code. These are appended on the normal FEN board code, also delimited with a `/`.

The format of the background colour is a single letter. I took inspiration from the white pieces being uppercase and black pieces lowercase, and encoded them with `G` (Light Grey), `g` (Dark Grey), `R` (Light Red) and `r` (Dark Red).

For the QR code snippet, since it's conveniently a 4x4 square of binary data, I decided to encode it as four little-endian hexadecimal digits, counting white as 1 and black as 0. That makes a full white row (`1111`) into `f`, `0111` into `e`, `1011` into `d` and so on until a full black row is `0000`/`0`.

With these additions, I can encode a full ARG board. For instance, the board for frequency 2854 would be encoded `pkpNbKPq/B6Q/k6b/p2PP2r/N2PP2P/b6q/K6B/pbNPKBnR/r/fc15` in LEFEN. Test it out in [my notation to board conversion tool!](https://afriestad.github.io/chesstiny/index.html)

### LEON — Lemons' Edge Optimised Notation

This is another variant notation I made mostly for my own usage near the end - since our goal with all these boards was to attach them by the edges, I wanted to encode those edges specifically. Also, since the piece layout of an ARG board is quite a bit more limited than on a normal chess board, I could make some optimisations and still encode the full boards. I therefore swapped out the FEN board layout for a variant that was more useful for this purpose. I also kept the extended fields from LEFEN, still plopped at the end.

LEON still uses the same characters as FEN for the board, but encodes as `top/right/bottom/left/centre` instead of fully encoding all 64 board squares. The sides all follow reading direction, that is, left to right for rows and top to bottom for columns, from white's player's position. Corner squares are included in both their row and column. The centre is encoded as a single cell, since all 4 squares always have the same value. The centre is counted as a very short row, such that it is encoded as `1` if it is empty (just as a normal empty row is `8`). This allowed me to re-use my row parsing logic, which was a nice boon. It encodes in about the same space as FEN — more specifically, for a well-formatted ARG board: 3 characters less if there is a centre piece and 3 characters more if there isn't — but also manages to encode the colour and QR. The goal was to have easy access to the edges, but saving space is nice too I guess.

Here's the LEON encoding for the frequency 2854 board: `pkpNbKPq/qQbrPqBR/pbNPKBnR/pBkpNbKp/1/r/fc15`. Compare and contrast with the LEFEN code above for the same board :)

Feel free to plug the LEON into [my notation to board conversion tool](https://afriestad.github.io/chesstiny/index.html) and play around with it a bit! It's probably not useful anymore, but hey, it's there!

## Thanks

Thank you to [TJ09](https://tjl.co/) for creating [the system in which all the data was assembled and verified](https://tjl.co/queens-gambit-arg/), including the API from which I fetch that data for my assembling engine and the visualiser where you can put the assembled board back in to see it! Thank you also for the chess piece symbols and the background image which I graciously borrowed (which is the reason why those are not included in the unlicence).

Thank you to everyone at RaidSecrets, the streamers and their communities for the amazing work in collecting and verifying the data! I literally could not have done it without you. Join us in [the Raidsecrets Discord](https://discord.gg/raidsecrets) for the next one!
