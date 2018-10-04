let ST = phys_Loc_Button = class extends phys_Button {

    constructor(corners = null, color = Q.config.color_button, size = 16){

        super();

        let dark = U.color.testDark(color);

        this.c_rect = new phys_Rect(color, Q.config.arc_size, corners).to(this);
        this.c_rect_light = new phys_Rect(0xFFFFFF, Q.config.arc_size, corners).eqv({ alpha : 0 }).to(this);
        this.c_tf = new phys_Loc_Text(size, dark ? 0xFFFFFF : 0x000000).to(this);
        dark && (this.c_tf.v.filters = [new PIXI.filters.DropShadowFilter({ distance : 1, alpha : 0.4, blur : 1, color : 0x000000 })]);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect.v, this);
            U.ev.emitSizes(this.c_rect_light.v, this);
            U.ev.emitSizes(this.c_tf.v, this);
        });

        U.ev.listen(this.v, phys_Button.EV_CHANGE, () => {
            U.an.make(this.c_rect_light.v, { alpha : (this.over ? 0.2 : 0) }, (this.over ? 3 : 8));
        });

    }

    put(text){
        this.c_tf.put(text);
        return this;
    }

}
