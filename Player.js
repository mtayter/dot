import AIEngineHeuristic from './AIEngineHeuristic.js';

export default class Player {
    constructor(name,color,hover,ai="human") {
        this.name = name;
        this.color = color;
        this.hover = hover;
        this.ai = (ai == "ai");
        this.aiEngine = this.ai ? new AIEngineHeuristic : null;
    }
}