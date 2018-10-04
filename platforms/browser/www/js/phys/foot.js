let ST = phys_Foot = class extends phys_Div {

    constructor(){

        super(Q.config.padding);

        this.c_rect = new phys_Rect(Q.config.color_ui_main).to(this.c_content_down);
        this.c_lenta = Q.lenta = new phys_Lenta(Q.config.color_ui_main).to(this.c_content);
        this.c_kingdom = new phys_Kingdom(Q.config.color_ui_main).to(this.c_content);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect.v, this);
            U.ev.emitSizes(this.c_lenta.v, (this.content_width - this.margin) * 0.7, this.content_height);
            this.c_lenta.v.x = this.content_width - this.c_lenta.width;
            U.ev.emitSizes(this.c_kingdom.v, (this.content_width - this.margin) * 0.3, this.content_height);
        });

    }

};
