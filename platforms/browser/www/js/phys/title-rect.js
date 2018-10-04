let ST = phys_TitleRect = class extends phys_DivRect {

    constructor(rect_color = Q.config.color_ui_title, text_color = Q.config.color_text_grey){

        super(rect_color);

        this.c_th = new phys_Loc_TextHTML(13, text_color).to(this.c_content).alignment('center', 'middle');

        U.ev.listenSizes(this.v, () => {
            U.ev.emitSizes(this.c_th.v, this.csizes);
        });

    }

};
