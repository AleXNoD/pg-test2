let ST = phys_Input = class extends phys_Div {

    constructor(){

        super(Q.config.padding_x2);

        this.c_bg = new phys_Rect(0xFFFFFF, Q.config.arc_size).to(this.c_content_down);
        this.c_ti = new phys_Loc_TextInput(14, 0x000000).to(this.c_content);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_bg.v, this);
            U.ev.emitSizes(this.c_ti.v, this.csizes);
        });

        U.ev.listen(this.c_ti.v, phys_TextInput.EV_ENTER, () => {
            U.ev.emit(this.v, ST.EV_ENTER);
        });

    }

};

ST.EV_ENTER = 'c_input.enter';
