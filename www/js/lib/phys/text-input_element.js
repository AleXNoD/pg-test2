let ST = phys_TextInput_Element = class extends phys_Base {

    constructor(){

        super();

        this.c_rect_bg = new phys_Rect(0x000000, 0, null, 0).to(this);
        this.c_rect_selection = new phys_Rect(0x000000).to(this);
        this.c_tf = new phys_Text().to(this);

        this.fill = null;

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_tf.v, this);
            U.ev.emitSizes(this.c_rect_bg.v, this);
            U.ev.emitSizes(this.c_rect_selection.v, this);
        });

        U.ev.listen(this.v, phys_Roll.EV_ITEM, (lit) => {
            this.c_tf.put(lit);
            U.ev.emitSizes(this.v, PIXI.TextMetrics.measureText(lit, this.c_tf.tf.style, false).width);
        });

        U.ev.listen(this.v, phys_Roll.EV_SELECTION, (yes) => {
            this.c_tf.editStyle({fill:(yes ? 0xFFFFFF : this.fill)});
            this.c_rect_selection.v.visible = yes ? true : false;
        });

    }

};
