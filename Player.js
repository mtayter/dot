import AIEngineHeuristic from './AIEngineHeuristic.js';
import AIEngineHybrid from './AIEngineHybrid.js';

export default class Player {
    constructor(name,color,hover,ai,thinkMs) {
        this.name = name;
        this.color = color;
        this.hover = hover;
        if(ai == "ai-heuristic") {
            this.ai = true;
            this.aiEngine = new AIEngineHeuristic;
        } else if(ai == "ai-hybrid") {
            this.ai = true;
            this.aiEngine = new AIEngineHybrid({ thinkMs });
        } else {
            this.ai = false;
            this.aiEngine = null;
        }
    }
}
