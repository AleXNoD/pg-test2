let ST = phys_Frame_PM_Head = class extends phys_Div {

    constructor(){

        super();
        this.setMargin(Q.config.padding, true, false, true, false);

        this.c_bg = new phys_Rect(0xFFFFFF).to(this.c_content_down);
        this.c_avatar = new phys_Loc_AvatarRound().to(this.c_content);
        this.c_th = new phys_Loc_TextHTML(20, 0x000000, 'center', 'middle').to(this.c_content);

        U.ev.listenSizes(this.v, () => {
            U.ev.emitSizes(this.c_bg.v, this);
            this.c_avatar.v.x = Q.config.padding_x2;
            U.ev.emitSizes(this.c_avatar.v, this.content_height, this.content_height);
            U.ev.emitSizes(this.c_th.v, this.csizes);
        });

        U.ev.listen(Q.pm, psy_PM.EV_OPEN_DIALOG, (contact_id) => {
            let info = Q.user.getPlayerInfo(contact_id);
            this.c_avatar.load(info.photo);
            this.c_th.put(Q.player.genName(contact_id, false));
        });

    }

};
