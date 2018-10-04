let ST = phys_Frame_PM_Contact = class extends phys_Div {

    constructor(){

        super(0);

        this.c_bg = new phys_Rect(0xFFFFFF).to(this.c_content_down);
        this.c_th = new phys_Loc_TextHTML(13, 0x000000, 'left', 'middle').to(this.c_content);
        this.c_online = new phys_Ellipse().to(this.c_content);
        this.c_button = new phys_Button(this.v);
        this.c_counter = new phys_Counter().to(this.c_content);

        this.online_size = 6;

        this.player_id = null;

        U.ev.listen(this.v, phys_Button.EV_CHANGE, () => {
            this.draw();
        }, this);

        new phys_ClickDetector(this.v, () => {
            Q.pm.openDialog(this.player_id);
        }, 3, 500, this);

        U.ev.listenSizes(this.v, () => {
            U.ev.emitSizes(this.c_bg.v, this);
            U.ev.emitSizes(this.c_th.v, this.content_width, this.content_height);
            this.c_th.v.x = this.content_width - this.c_th.width;
            U.ev.emitSizes(this.c_online.v, this.online_size, this.online_size);
            this.c_online.v.x = this.content_width - this.c_online.width;
            this.c_online.v.y = (this.content_height - this.c_online.height) / 2;
            let counter_size = this.content_height - 4;
            U.ev.emitSizes(this.c_counter.v, counter_size, counter_size);
            this.c_counter.v.y = 2;
            this.c_counter.v.x = this.c_online.v.x - 5 - counter_size;
        }, this);

        U.ev.listen(this.v, phys_Roll.EV_ITEM, (contact) => {
            this.player_id = contact.id;
            this.height = 20;
            U.ev.emitSizes(this.v);
            this.displayInfo();
        }, this);

        U.ev.listen(this.v, phys_Roll.EV_ITEM_PARAMETERS, (p) => {
            this.c_bg.setColor(p.n % 2 !== 0 ? 0xFFFFFF : 0xFAFAFA);
        }, this);

        U.ev.listen(Q.pm, psy_PM.EV_RENDER_CONTACTS_LITE, (contacts) => {
            this.displayInfo();
        }, this);

    }

    displayInfo(){
        let contact = Q.pm.contacts[this.player_id];
        let info = Q.user.getPlayerInfo(this.player_id);
        this.c_th.put(Q.player.genName(this.player_id, false));
        let is_current = Q.pm.testCurrentContact(this.player_id);
        this.c_button.setCurrent(is_current);
        this.c_online.setColor(info.online ? Q.config.color_ui_light : Q.config.color_ui_grey);
        this.c_counter.put(contact.unread);
    }

    draw(){
        U.an.make(this.c_th.c_content.v, { x : (this.c_button.current || this.c_button.over ? 10 : 0) }, this.c_button.current ? 0 : 3);
    }

};
