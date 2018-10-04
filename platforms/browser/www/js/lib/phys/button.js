let ST = phys_Button = class extends phys_Base {

    constructor(v){

        super(v);

        this.over = false;
        this.freeze = false;
        this.press = false;
        this.current = false;

        this.group = null;
        this.over_point = null;

        this.callback = null;
        this.if_callback = null;

        this.v.buttonMode = true;

        U.ev.listen(this.v, 'mouseover_alternative', () => {
            this.over = true;
            U.ev.emit(this.v, ST.EV_CHANGE);
        });

        U.ev.listen(this.v, 'mouseout_alternative', () => {
            this.over = false;
            this.press = false;
            U.ev.emit(this.v, ST.EV_CHANGE);
        });

        U.ev.listen(this.v, 'mousemove', () => {
            U.control.addOver(this);
        });

        U.ev.listen(this.v, 'mousedown', () => {
            this.press = true;
            U.ev.emit(this.v, ST.EV_CHANGE);
            ST.cb_mode == ST.MODE_PRESS && this.callCallback();
        });

        U.ev.listen(this.v, 'mouseup', () => {
            this.press = false;
            U.ev.emit(this.v, ST.EV_CHANGE);
        });

        U.ev.listen(this.v, 'tap', () => {
            this.callCallback(); // ST.cb_mode == ST.MODE_TAP &&
        });

        U.ev.listen(this.v, 'click', () => {
            ST.cb_mode == ST.MODE_CLICK && this.callCallback();
        });

        U.ev.listen(this.v, 'kill', () => {
            this.setAboveArea(null);
        });

        U.ev.listen(this.v, ST.EV_CHANGE, () => {
            let enable = this.freeze || this.current ? false : true;
            this.v.interactive = enable;
        }, this);

        this.setCurrent(false);

    }

    setAboveArea(v){
        U.ev.removeEvi(this.evi_above_area);
        this.evi_above_area = null;
        v && (this.evi_above_area = U.ev.listen(v, 'mouseout', () => {
            U.ev.emit(this.v, 'mouseout');
        }));
        return this;
    }

    setCurrent(flag){
        this.current = flag ? true : false;
        U.ev.emit(this.v, ST.EV_CHANGE);
    }

    setCurrentInGroup(){
        if(this.group){
            U.loop.foreach(this.group, (c_button) => {
                c_button.setCurrent(false);
            });
            this.setCurrent(true);
        }
    }

    setFreeze(flag){
        this.freeze = flag ? true : false;
        U.ev.emit(this.v, ST.EV_CHANGE);
    }

    callCallback(){
        if(!this.if_callback || this.if_callback()){
            let result = this.callback ? this.callback() : undefined;
            if (result || result === undefined){
                this.setCurrentInGroup();
            }
        }
    }

};

ST.EV_CHANGE = 'button.change';
ST.MODE_TAP = 'tap';
ST.MODE_PRESS = 'press';
ST.MODE_CLICK = 'click';
ST.cb_mode = ST.MODE_PRESS;
