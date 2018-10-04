let ST = psy_Queue = class {

    constructor(){

        this.queue = [];
        this.loops_max = 3;
        this.timeout = 6000;

    }

    add(pack, callback_execute = null){
        this.queue.push({ pack, loops : 0, callback_execute });
        this.queue.length == 1 && this.execute();
    }

    execute(){
        if(this.queue.length){
            U.co.async(() => {
                let qi = this.queue[0];
                if(qi.loops < this.loops_max){
                    qi.loops++;
                    let timeout_id = U.co.async(() => {
                        timeout_id = null;
                        this.execute();
                    }, this.timeout);
                    qi.callback_execute(qi.pack, () => {
                        if(timeout_id){
                            clearTimeout(timeout_id);
                            this.finish();
                        }
                    });
                } else this.finish();
            });
        }
    }

    finish(){
        if(this.queue.length){
            this.queue.shift();
            this.execute();
        }
    }

}
