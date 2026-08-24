export default class DotGame {
    constructor(height,width,player1,player2,ctx,scoreboard) {
        this.vLines = Array.from({ length: height }, () => Array(width+1).fill(0));
        this.hLines = Array.from({ length: width }, () => Array(height+1).fill(0));
        this.squares = Array.from({ length: height }, () => Array(width).fill(0));
        this.squaresLeft = height * width;
        this.players = [player1,player2];
        this.ctx = ctx;
        this.scoreboard = scoreboard;
        this.turn = 1;
        this.sq = undefined;
        this.dt = undefined;
        this.crn = undefined;
        this.curLine = '';
        this.checkAImove();
        this.ctx.canvas.onmousemove = (e) => {

            if(this.players[this.turn-1].ai) {
                return;
            }
            const rect = this.ctx.canvas.getBoundingClientRect();
            
            // Calculate actual coordinate relative to the internal canvas drawing space
            let x = (e.clientX - rect.left) * (this.ctx.canvas.width / rect.width);
            let y = (e.clientY - rect.top) * (this.ctx.canvas.height / rect.height);

            let newLine = '';
            let o,i,j;

            x = x - (this.crn + this.dt);
            y = y - (this.crn - this.dt);
            if(x>0 && x<(this.hLines.length*this.sq)           && (x%this.sq) < (this.sq - 2 * this.dt) &&
               y>0 && y<(this.vLines.length*this.sq+2*this.dt) && (y%this.sq) < (2 * this.dt)) {
                i = Math.trunc(x/this.sq);
                j = Math.trunc(y/this.sq);
                if(this.hLines[i][j] <= 0) {
                    newLine = 'h' + ',' + i + ',' + j;
                    this.hLines[i][j] = -this.turn;
               }
            }

            x = x + (this.dt * 2);
            y = y - (this.dt * 2);
            if(y>0 && y<(this.vLines.length*this.sq)           && (y%this.sq) < (this.sq - 2 * this.dt) &&
               x>0 && x<(this.hLines.length*this.sq+2*this.dt) && (x%this.sq) < (2 * this.dt)) {
                i = Math.trunc(y/this.sq);
                j = Math.trunc(x/this.sq);
                if(this.vLines[i][j] <= 0) {
                    newLine = 'v' + ',' + i + ',' + j;
                    this.vLines[i][j] = -this.turn;
               }
            }

            if(this.curLine != newLine) {
                if(this.curLine != '') {
                    [o,i,j] = this.curLine.split(',');
                    if(o == 'h') {
                        this.hLines[i][j] = 0;
                    } else if(o =='v') {
                        this.vLines[i][j] = 0;
                    }
                }
                this.curLine = newLine;
                this.render();
            }

        }
        this.ctx.canvas.onclick = (e) => {
            if(this.players[this.turn-1].ai) {
                return;
            }
            if(this.curLine != '') {
                this.move(this.curLine);
                this.curLine = '';
           }
        }
    }
    move(m) {
        let o,i,j,p,x,y,closed = false;
        [o,i,j] = m.split(',');
        i = parseInt(i);
        j = parseInt(j);
        if(o == 'h') {
            this.hLines[i][j] = this.turn;
            y = [j-1,j];
            x = [i,i];
        } else if(o == 'v') {
            this.vLines[i][j] = this.turn;
            y = [i,i];
            x = [j-1,j]
        }
        for(let i=0; i<2; i++) {
            if(this.checkClosed(y[i],x[i])) {
                this.squaresLeft--;
                this.scoreboard.point(this.turn);
                this.squares[y[i]][x[i]] = this.turn;
                closed = true;
            }
        }
        if(!closed) {
            this.toggleTurn();
        }
        this.render();
        if(this.squaresLeft == 0) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if(this.scoreboard.whoWon() == 0) {
                        alert('Tie!');
                    } else {
                        alert('Player ' + this.scoreboard.whoWon() + ' Wins!');
                    }
                }, 0);
            });
        } else {
            this.checkAImove();
        }
    }
    checkClosed(y,x) {
        if(y<0 || x<0 || y >= this.vLines.length || x >= this.hLines.length) {
            return false;
        }
        let s = 0;
        s += (this.hLines[x][y] > 0);
        s += (this.hLines[x][y+1] > 0);
        s += (this.vLines[y][x] > 0);
        s += (this.vLines[y][x+1] > 0);
        if(s == 4) {
            return true;
        } else {
            return false;
        }
    }
    render() {
        // canvas dimensions
        let w = this.ctx.canvas.width;
        let h = this.ctx.canvas.height;

        this.sq = Math.min(Math.round(h / (this.vLines.length + 1)),Math.round(w / (this.hLines.length + 1))); // square height/width
        this.dt = Math.round(this.sq/15); // dot radius
        this.crn = Math.round(this.sq/2); // top left corner

        this.ctx.clearRect(0,0,w,h);

        for(let y=0; y<=this.vLines.length; y++) {
            for(let x=0; x<=this.hLines.length; x++) {
                this.circle(this.crn + x*this.sq, this.crn + y*this.sq, this.dt);
            }
        }
        let x,y,rx, ry, rw, rh, rp, c;
        for(x=0; x<this.hLines.length; x++) {
            for(y=0; y<this.hLines[x].length; y++) {
                if(this.hLines[x][y] != 0) {
                    rx = this.sq/2 + this.dt + x*this.sq;
                    ry = this.sq/2 - this.dt + y*this.sq;
                    rw = this.sq-this.dt*2;
                    rh = this.dt*2;
                    rp = this.hLines[x][y];
                    if(rp<0) {
                        c = this.players[-rp-1].hover;
                    } else {
                        c = this.players[rp-1].color;
                    }
                    this.rect(rx,ry,rw,rh,c);
                }
            }
        }
        for(y=0; y<this.vLines.length; y++) {
            for(x=0; x<this.vLines[y].length; x++) {
                if(this.vLines[y][x] != 0) {
                    rx = this.sq/2 - this.dt + x*this.sq;
                    ry = this.sq/2 + this.dt + y*this.sq;
                    rw = this.dt*2;
                    rh = this.sq-this.dt*2;
                    rp = this.vLines[y][x];
                    if(rp<0) {
                        c = this.players[-rp-1].hover;
                    } else {
                        c = this.players[rp-1].color;
                    }
                    this.rect(rx,ry,rw,rh,c);
                }
            }
        }
        for(y=0; y<this.squares.length; y++) {
            for(x=0; x<this.squares[y].length; x++) {
                if(this.squares[y][x] > 0) {
                    rx = this.sq/2 + this.dt*2 + x*this.sq;
                    ry = this.sq/2 + this.dt*2 + y*this.sq;
                    rw = this.sq - this.dt*4;
                    this.rect(rx,ry,rw,rw,this.players[this.squares[y][x]-1].color);
                }
            }
        }
    }
    circle(x,y,rad) {
        this.ctx.beginPath();
        this.ctx.arc(x,y,rad,0,Math.PI*2)
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
    }
    rect(x,y,width,height,color) {
        this.ctx.beginPath();
        this.ctx.rect(x,y,width,height);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    toggleTurn() {
        if(this.turn == 1) {
            this.turn = 2;
        } else {
            this.turn = 1;
        }
        this.scoreboard.switchActivePlayer(this.turn);
    }
    async checkAImove() {
        if(this.players[this.turn-1].ai) {
            const m = await this.players[this.turn-1].aiEngine.move(this.hLines,this.vLines);
            this.move(m);
        }
    }
}
