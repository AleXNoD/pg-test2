let ST = psy_Timer = class {

    constructor(frequency, callback = null, loops = 0){
        this.loop = 0;
        this.loops_max = loops;
        this.frequency = frequency;
        this.callback = callback;
        this.interval_id = null;
    }

    start(){
        this.stop();
		this.interval_id = setInterval(() => {
            this.callback();
            this.loops_max && (++this.loop == this.loops_max && this.stop());
        }, this.frequency);
        return this;
	}

    stop(){
        this.interval_id && clearInterval(this.interval_id);
        return this;
    }

}
