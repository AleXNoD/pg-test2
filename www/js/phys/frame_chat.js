let ST = phys_Frame_Chat = class extends phys_Div {

    constructor(){

        super();

        this.c_messages = new phys_Messages().to(this.c_content);
        this.c_input = new phys_MessagesInput().to(this.c_content);
        this.c_menu = new phys_Frame_Chat_Menu().to(this.c_content);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_input.v, this.width, 55);
            let menu_width = U.calc.fringeMax(this.width * 0.3, 201);
            U.ev.emitSizes(this.c_messages.v, this.width - menu_width, this.height - this.c_input.height);
            U.ev.emitSizes(this.c_menu.v, menu_width, this.c_messages.height);
            this.c_menu.v.x = this.c_messages.width;
            this.c_input.v.y = this.c_messages.height;
        });

        U.ev.listen(this.c_input.v, phys_MessagesInput.EV_SEND, (message) => {
            Q.chat.sendMessageSafe(message, () => {
                this.c_input.clear();
            });
        });

    }

};
