let ST = phys_MoveDetector = class {

    constructor(c, callback = null){
        this.c = c;
        this.callback = callback;
    }

    start(){
        this.stop();
        this._tick = this.c.ticker(() => {
            this.prev_point && U.co.exe(this.callback, new PIXI.Point(U.control.mouse.x - this.prev_point.x, U.control.mouse.y - this.prev_point.y), new PIXI.Point(U.control.mouse.x - this.start_point.x, U.control.mouse.y - this.start_point.y));
            this.prev_point = U.control.mouse.clone();
        });
        this.start_point = U.control.mouse.clone();
        this.prev_point = U.control.mouse.clone();
    }

    stop(){
        this.c.removeTick(this._tick);
    }

};
