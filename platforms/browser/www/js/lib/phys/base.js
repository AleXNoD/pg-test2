let ST = phys_Base = class {

    constructor(v = null){

        this.v = v || new PIXI.Container();
        this.width = 0;
        this.height = 0;
        this.prev_width = 0;
        this.prev_height = 0;
        this.ticker_callbacks = new Set();
        this.evis = new Set();

        U.ev.listen(this.v, 'sizes', (sizes) => {
            (sizes.width !== null) && (this.prev_width = this.width);
            (sizes.height !== null) && (this.prev_height = this.height);
            (sizes.width !== null) && (this.width = sizes.width);
            (sizes.height !== null) && (this.height = sizes.height);
        });

        U.ev.listen(this.v, 'kill', () => {
            this.destroy();
        });

    }

    add(object){
        U.loop.foreachSome(object, (object) => {
            let v = object instanceof phys_Base ? object.v : object;
            this.v.addChild(v);
        });
        return this;
    }

    addEvi(evi){
        this.evis.add(evi);
    }

    to(object){
        let v = object instanceof phys_Base ? object.v : object;
        v.addChild(this.v);
        return this;
    }

    resize(width = null, height = null){
        U.ev.emitSizes(this.v, width, height);
        return this;
    }

    pos(x = null, y = null){
        x !== null && (this.v.x = x);
        y !== null && (this.v.y = y);
        return this;
    }

    eqv(parameters){
        U.co.eq(this.v, parameters);
        return this;
    }

    eq(parameters){
        U.co.eq(this, parameters);
        return this;
    }

    sizes(callback){
        U.ev.listenSizes(this.v, callback);
        return this;
    }

    ticker(callback, prev_callback = null){
        prev_callback && this.removeTick(prev_callback);
        this.ticker_callbacks.add(callback);
        APP.ticker.add(callback);
        return callback;
    }

    removeTick(callback){
        if(this.ticker_callbacks.has(callback)){
            this.ticker_callbacks.delete(callback);
            APP.ticker.remove(callback);
        }
    }

    removeTicks(){
        for(let ticker_callback of this.ticker_callbacks){
            this.removeTick(ticker_callback);
        }
    }

    removeEvis(){
        for(let evi of this.evis){
            U.ev.removeEvi(evi);
        }
    }

    destroy(){
        this.v = null;
        this.removeTicks();
        this.removeEvis();
    }

}
