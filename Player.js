import AIEngineHeuristic from './AIEngineHeuristic.js';
import AIEngineMCTS from './AIEngineMCTS.js';

export default class Player {
    constructor(name,color,hover,ai="human") {
        this.name = name;
        this.color = color;
        this.hover = hover;
        if(ai == "ai-heuristic") {
            this.ai = true;
            this.aiEngine = new AIEngineHeuristic;
        } else if(ai == "ai-mcts") {
            this.ai = true;
            this.aiEngine = new AIEngineMCTS;
        } else {
            this.ai = false;
            this.aiEngine = null;
        }
    }
}