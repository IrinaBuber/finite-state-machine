class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {   
        if (config) {
            this._config = config;     
            this._currentState = config.initial; 
            this._undoHistory = [];
            this._redoHistory = [];
            return;              
        }
        throw new Error("Config is not defined");
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {    
        if (this._config.states[state]) {
            this._undoHistory.push(this._currentState);
            this._redoHistory.length = 0;
            this._currentState = state;
            return;
        }
        throw new Error(`State ${state} is not found`);
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
       let tmp = this._config.states[this._currentState].transitions[event];
       if (tmp){
         this._undoHistory.push(this._currentState);
         this._redoHistory.length = 0;
         this._currentState = tmp;
         return;
       }
       throw new Error(`Event ${event} not exists in state ${this_._currentState}`);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._currentState = this._config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let result = [];       
        let that = this; 
        if (event) {
            Object.keys(this._config.states).forEach((state) => { 
                Object.keys(that._config.states[state].transitions).forEach((transition) => { 
                    if (transition === event) result.push(state)
                }); 
            });
        }
        else {        
            Object.keys(this._config.states).forEach((state) => { result.push(state); });
        }
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        let result = false;
        if (this._undoHistory.length === 0) return result;
        let tmp = this._undoHistory.pop();
        if (tmp){
            this._redoHistory.push(this._currentState);
            this._currentState = tmp;
            result = true;
        }      
        return result;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        let result = false;
        if (this._redoHistory.length === 0) return result;
        let tmp = this._redoHistory.pop();
        if (tmp){
            this._undoHistory.push(this._currentState);
            this._currentState = tmp;
            result = true;
        }      
        return result;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
         this._undoHistory.length = 
         this._redoHistory.length = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
