let ST = phys_Win_Alert = class extends phys_Win {

    constructor(title, text, buttons = []){

        super('alert');

        this.buttons = buttons;

        this.c_head.setText(title);

        this.c_th = new phys_Loc_TextHTML(18, 0x000000, phys_TextHTML.ALIGN_CENTER, phys_TextHTML.VALIGN_MIDDLE).to(this.c_div.c_content);
        this.c_th.put(text);

        this.c_content_buttons = new phys_Base().to(this.c_div.c_content);

        U.ev.listen(this.v, 'sizes', (e) => {
            U.ev.emitSizes(this.c_th.v, this.c_div.content_width);
            let buttons_height = this.drawButtons();
            // Определяем высоту на основе содержимого (если не задана явно, а она не задана в алерте)
            e.height == null && U.ev.emitSizes(this.v, null, this.title_height + this.c_th.text_height + (buttons_height ? buttons_height + this.c_div.margin : 0) + this.c_div.getMarginVerticalSize());
            this.c_content_buttons.v.y = this.c_th.text_height + this.c_div.margin;
        });

        U.ev.emitSizes(this.v, 400);

    }

    drawButtons(){
        U.vis.killChildren(this.c_content_buttons.v);
        let elements_c = [];
        U.loop.foreach(this.buttons, (button) => {
            let c_button = new phys_Loc_Button().to(this.c_content_buttons);
            elements_c.push(c_button);
            c_button.put(button[0]);
            c_button.callback = button[1] || (() => {
                U.ev.emit(this.v, phys_Stekbox.EV_CLOSE);
            });
        });
        return U.spread.inPlacement(Q.config.padding, elements_c, this.c_div.content_width, Q.config.button_def_height, 'y');
    }

};
