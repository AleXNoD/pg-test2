let ST = phys_Kingdom = class extends phys_Base {

    constructor(){

        super();

        this.c_rect = new phys_Rect(Q.config.color_ui_dark).to(this);
        new phys_Mask(this.v, phys_Mask.MODE_RECT, Q.config.arc_size);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect.v, this);
        });

    }

};
