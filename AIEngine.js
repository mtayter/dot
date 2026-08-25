export default class AIEngine { 
    constructor() {
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async move(h,v) {

        await this.sleep(10);

        let x = h.length;
        let y = v.length;

        let squares = this.countSquares(h,v);

        // complete any available squares
        for(let i=0; i<y; i++) {
            for(let j=0; j<x; j++) {
                if(squares[i][j] == 3) {
                    if(h[j][i] == 0) {
                        return "h,"+j+","+i;
                    }
                    if(h[j][i+1] == 0) {
                        return "h,"+j+","+(i+1);
                    }
                    if(v[i][j] == 0) {
                        return "v,"+i+","+j;
                    }
                    if(v[i][j+1] == 0) {
                        return "v,"+i+","+(j+1);
                    }
                }
            }
        }

        let moves = [];
        // choose spot that doesn't result in any closable squares
        for(let i=0; i<y; i++) {
            for(let j=0; j<x; j++) {
                if(squares[i][j] < 2) {
                    // check top of box
                    if(h[j][i] == 0) {
                        if(i==0 || squares[i-1][j] < 2) {
                            moves.push("h,"+j+","+i);
                        }
                    }
                    // for bottom row, also check bottom of box
                    if(i==(y-1) && h[j][i+1] == 0) {
                        if(squares[i][j] < 2) {
                            moves.push("h,"+j+","+(i+1));
                        }
                    }
                    // check left of box
                    if(v[i][j] == 0) {
                        if(j==0 || squares[i][j-1] < 2) {
                            moves.push("v,"+i+","+j);
                        }
                    }
                    // for last column, also check right of box
                    if(j==(x-1) && v[i][j+1] == 0) {
                        if(squares[i][j] < 2) {
                            moves.push("v,"+i+","+(j+1));
                        }
                    }
                }
            }
        }
        if(moves.length > 0) {
            return moves[Math.floor(Math.random() * moves.length)];
        }

        // choose random spot
        for(let i=0; i<h.length; i++) {
            for(let j=0; j<h[i].length; j++) {
                if(h[i][j] == 0) {
                    moves.push("h,"+i+","+j);
                }
            }
        }
        for(let i=0; i<v.length; i++) {
            for(let j=0; j<v[i].length; j++) {
                if(v[i][j] == 0) {
                    moves.push("v,"+i+","+j);
                }
            }
        }
        return moves[Math.floor(Math.random() * moves.length)];
    }
    countSquares(h,v) {
        let squares = [];
        for(let i=0; i<v.length; i++) {
            squares[i] = [];
            for(let j=0; j<h.length; j++) {
                squares[i][j] = (h[j][i] != 0) + (h[j][i+1] != 0) + (v[i][j] != 0) + (v[i][j+1] != 0);
            }
        }
        return squares;
    }
}