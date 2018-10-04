let ST = phys_Frame_Chat_Menu_Element = class extends phys_Div {

    constructor(){

        super();

        this.chat_id = 0;

        this.point_size = 6;

        this.setMargin(Q.config.padding, false, true, false, true);

        this.c_bg = new phys_Rect(0xFFFFFF).to(this.c_content_down);
        this.c_tf_name = new phys_Loc_Text(12, 0x000000).to(this.c_content).alignment('left', 'middle');
        this.c_tf_online = new phys_Loc_Text(12, 0x000000).to(this.c_content).alignment('right', 'middle');
        this.c_point_container = new phys_Base().to(this.c_content);
        this.c_point_container.v.scale.set(0);
        this.c_point = new phys_Rect(Q.config.color_ui_main, 2).eqv({x : -this.point_size/2, y : -this.point_size/2}).to(this.c_point_container);
        U.ev.emitSizes(this.c_point.v, this.point_size, this.point_size);

        U.ev.listenSizes(this.v, () => {
            U.ev.emitSizes(this.c_bg.v, this);
            U.ev.emitSizes(this.c_tf_name.v, this.csizes);
            U.ev.emitSizes(this.c_tf_online.v, this.csizes);
            this.c_point_container.v.y = this.content_height / 2;
            this.c_point_container.v.x = this.point_size / 2;
        });

        this.c_button = new phys_Button(this.v);
        this.c_button.callback = () => {
            Q.chat.enter(this.chat_id);
            return false;
        };

        U.ev.listen(this.v, phys_Button.EV_CHANGE, () => {
            U.an.make(this.c_tf_name.v, { x : (this.c_button.current || this.c_button.over ? 11 : 0) }, 4);
            U.an.make(this.c_point_container.v, { scale : (this.c_button.current ? 1 : 0) }, 4);
        });

    }

    addInfo(info){
        this.chat_id = info.id;
        this.c_tf_name.put(Q.chat.genName(info.id));
        this.c_tf_online.put(info.online);
    }

};
