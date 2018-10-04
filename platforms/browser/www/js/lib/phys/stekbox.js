let ST = phys_Stekbox = class extends phys_Base {

    constructor(substrate_alpha = 0, substrate_an_factor_show = 10, substrate_an_factor_hide = 4){

        super();

        this.c_substrate = new phys_Rect(0).eqv({visible : false, alpha : 0});
        this.c_container = new phys_Base().to(this);

        this.substrate_alpha = substrate_alpha;
        this.substrate_an_factor_show = substrate_an_factor_show;
        this.substrate_an_factor_hide = substrate_an_factor_hide;
        this.mono_mode = false;
        this.names = {};
        this.elements = new Set();

        this.c_substrate_button = new phys_Button(this.c_substrate.v);
        this.c_substrate_button.callback = () => {
            this.pop();
        };

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_substrate.v, this);
            U.loop.foreach(Array.from(this.elements), (v) => {
                U.ev.emitSizes(v);
            });
        });

    }

    pop(){
        if(this.elements.size >= 1){
            U.ev.emit(Array.from(this.elements)[this.elements.size - 1], ST.EV_CLOSE);
            return true;
        } else return false;
    }

    shift(){
        if(this.elements.size >= 1){
            U.ev.emit(Array.from(this.elements)[0], ST.EV_CLOSE);
            return true;
        } else return false;
    }

    shiftExceptTop(){
        while (this.elements.size > 1) {
            shift();
        }
    }

    getCount(){
        return this.elements.size;
    }

    add(c, name = null){
        let v = c.v;
        this.c_container.add(c);
        this.elements.add(v);
        v.interactive = true;
        name && (this.names[name] = c);
        U.ev.listen(v, 'sizes', () => {
            this.centerize(c);
        });
        U.ev.listen(v, ST.EV_CLOSE, () => {
            this.remove(v, name);
        });
        U.ev.emitSizes(v);
        this.deploySubstrate();
        U.ev.emit(this.v, ST.EV_ADD, c);
    }

    centerize(c){
        c.v.x = Math.round((this.width - c.width) / 2);
        c.v.y = Math.round((this.height - c.height) / 2);
    }

    clear(){
        while(pop());
    }

    remove(v, name = null){
        //U.vis.kill(v);
        this.elements.delete(v);
        v.interactive = false;
        name && this.names[name] && (delete this.names[name]);
        this.deploySubstrate();
    }

    getByName(name){
        return this.names[name];
    }

    closeByName(name){
        this.names[name] && U.ev.emit(this.names[name].v, ST.EV_CLOSE);
    }

    deploySubstrate(){
        let new_layer = this.elements.size - 1;
        this.c_container.v.addChildAt(this.c_substrate.v, new_layer < 0 ? 0 : new_layer);
        let exists = this.elements.size > 0;
        if(exists){
            this.c_substrate_button.setFreeze(false);
            this.c_substrate.v.visible = true;
            this.substrate_alpha && U.an.make(this.c_substrate.v, { alpha : this.substrate_alpha }, this.substrate_an_factor_show);
            U.loop.foreach(this.c_container.v.children, (v_element, n) => {
                v_element.visible = this.mono_mode ? n >= new_layer : true;
            });
        } else {
            this.c_substrate_button.setFreeze(true);
            if(this.substrate_alpha){
                U.an.make(this.c_substrate.v, { alpha : 0 }, this.substrate_an_factor_hide).callback = () => {
                    this.c_substrate.v.visible = false;
                };
            } else this.c_substrate.v.visible = false;
        }
    }

};

ST.EV_ADD = 'stekbox.add';
ST.EV_PREADD = 'stekbox.preadd';
ST.EV_REQUEST_SIZES = 'stekbox.request_sizes';
ST.EV_CLOSE = 'stekbox.close';
