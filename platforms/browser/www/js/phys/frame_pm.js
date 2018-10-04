let ST = phys_Frame_PM = class extends phys_Div {

    constructor(){

        super();

        this.c_head = new phys_Frame_PM_Head().to(this.c_content);
        this.c_messages = new phys_Messages().to(this.c_content);
        this.c_input = new phys_MessagesInput().to(this.c_content);
        this.c_panel = new phys_Frame_PM_Panel().to(this.c_content);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_input.v, this.width, 55);
            let panel_width = U.calc.fringeMax(this.width * 0.3, 201);
            U.ev.emitSizes(this.c_head.v, this.width - panel_width, 38);
            U.ev.emitSizes(this.c_messages.v, this.width - panel_width, this.height - this.c_input.height - this.c_head.height - 1);
            U.ev.emitSizes(this.c_panel.v, panel_width, this.content_height - this.c_input.height);
            this.c_panel.v.x = this.c_messages.width;
            this.c_messages.v.y = this.c_head.v.x + this.c_head.height + 1;
            this.c_input.v.y = this.c_messages.v.y + this.c_messages.height;
        });

        U.ev.listen(Q.pm, psy_PM.EV_OPEN_DIALOG, (contact_id) => {
            this.c_messages.c_roll.terminate();
            this.c_messages.addPosts(Q.pm.contacts[contact_id].posts);
            this.c_messages.c_roll.scrollBottom();
        });

        U.ev.listen(Q.pm, psy_PM.EV_ADD_POST_CURRENT, (post) => {
            this.c_messages.addPosts(post);
        });

        U.ev.listen(this.c_input.v, phys_MessagesInput.EV_SEND, (message) => {
            Q.pm.sendMessage(message);
            this.c_input.clear();
        });

        U.ev.listen(this.c_input.c_input.c_ti.v, phys_TextInput.EV_INPUT, () => {
            Q.pm.setTypingOut();
        });

        U.ev.listen(this.v, phys_Frames.EV_SHOW, () => {
            Q.pm.clearCurrentUnread();
        });

    }

};
