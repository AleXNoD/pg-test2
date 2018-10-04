let ST = phys_Animation = class extends phys_Base {

    constructor(v, key, aim, factor, type, callback = null){

        super(v);

        if(aim instanceof Array){
            v[key] = aim[0];
            aim = aim[1];
        }

        U.ev.emit(this.v, ST.EV_STOP, key);

        this.callback = callback;
        this.key = key;
        this.aim = aim;
        this.factor = factor;
        this.type = type;

        if(this.key == 'scale.x' || this.key == 'scale.y'){
            let [scaleKey, scaleDimension] = this.key.split('.');
            this.valueGet = () => {
                return this.v[scaleKey][scaleDimension];
            };
            this.valueSet = (aim) => {
                return this.v[scaleKey][scaleDimension] = aim;
            };
        } else {
            this.valueGet = () => {
                return this.v[this.key];
            };
            this.valueSet = (aim) => {
                return this.v[this.key] = aim;
            };
        }

        U.ev.listen(this.v, ST.EV_STOP, (key) => {
            if(!key || this.key == key){
                this.destroy();
            }
        });

        if(factor){
            this.initAnimation();
        } else this.end();

    }

    initAnimation(){
        this.removeTicks();
        if(this.type == ST.TYPE_SLOWDOWN){
            this.ticker(delta => {
                let cut = this.aim - this.valueGet();
                let value = this.valueGet();
                this.valueSet(value + cut / this.factor);
                if(Math.abs(value - this.valueGet()) < 0.0002){
                    this.end();
                }
            });
        } else {
            this.end();
        }
    }

    end(){
        this.valueSet(this.aim);
        U.co.exe(this.callback);
        this.destroy();
    }

};

ST.EV_STOP = 'phys_animation.stop';
ST.TYPE_SLOWDOWN = 1;
