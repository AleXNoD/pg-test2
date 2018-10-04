let ST = phys_MessagesInput = class extends phys_Div {

    constructor(){

        super(Q.config.padding_x2);

        this.c_bg = new phys_Rect(Q.config.color_ui_grey).to(this.c_content_down);
        this.c_input = new phys_Input().to(this.c_content);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_bg.v, this);
            U.ev.emitSizes(this.c_input.v, this.csizes);
        });

        U.ev.listen(this.c_input.v, phys_Input.EV_ENTER, () => {
            U.ev.emit(this.v, ST.EV_SEND, this.c_input.c_ti.getText());
        });

    }

    clear(){
        this.c_input.c_ti.clear();
    }

};

ST.EV_SEND = 'c_messages_input.send';
