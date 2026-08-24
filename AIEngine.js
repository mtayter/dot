export default class AIEngine { 
    constructor() {
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async move(h,v) {
        let moves = [];
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
        await this.sleep(10);
        return moves[Math.floor(Math.random() * moves.length)];
    }
}