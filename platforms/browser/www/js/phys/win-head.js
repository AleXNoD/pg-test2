let ST = phys_WinHead = class extends phys_Base {

    constructor(){

        super();

        this.c_rect = new phys_Rect(Q.config.color_win_head).to(this);
        this.c_border_rect = new phys_Rect(0x000000, 0, null, 0.2).to(this);
        this.c_div = new phys_Div(Q.config.padding).to(this);
        this.c_tf = new phys_Loc_Text(19, 0xFFFFFF).to(this);
        this.c_tf.attachShadow(0, 5, 1, 0.3);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect.v, this);
            U.ev.emitSizes(this.c_div.v, this);
            U.ev.emitSizes(this.c_tf.v, this);
            U.ev.emitSizes(this.c_border_rect.v, this.width, 1);
            this.c_border_rect.v.y = this.height - 1;
        });

    }

    setText(text){
        this.c_tf.put(text);
    }

};
