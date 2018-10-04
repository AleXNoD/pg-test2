let ST = phys_HeadBar = class extends phys_Div {

    constructor(){

        super(Q.config.padding);

        this.c_rect = new phys_Rect(Q.config.color_ui_main).to(this.c_content_down);
        this.c_avatar = new phys_Loc_Avatar().to(this.c_content);
        this.c_logo = new phys_HeadBarLogo().to(this.c_content);
        this.c_tf = new phys_Loc_Text(14, 0xFFFFFF).eq({halign:'left'}).to(this.c_content);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect.v, this);
            U.ev.emitSizes(this.c_avatar.v, 45, this.content_height);
            this.c_logo.calcSize(this.content_height);
            this.c_logo.v.x = this.content_width - this.c_logo.width;
            U.ev.emitSizes(this.c_tf.v, 400, this.content_height);
            this.c_tf.v.x = this.c_avatar.width + this.margin * 2;
        });

        U.ev.listen(Q.player, U.text.glue([psy_Player.EV_UPD_CURRENT_PARAM, 'photo']), (value) => {
            this.c_avatar.load(value);
        });

        U.ev.listen(Q.player, U.text.glue([psy_Player.EV_UPD_CURRENT_PARAM, 'name']), (value) => {
            this.c_tf.put(value);
        });

    }

}
