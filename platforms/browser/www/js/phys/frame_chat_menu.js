let ST = phys_Frame_Chat_Menu = class extends phys_Div {

    constructor(){

        super();
        this.setMargin(1, false, false, false, true);

        this.title_height = 38;
        this.element_height = 21;

        this.c_title = new phys_TitleRect(0xFFFFFF).to(this.c_content);
        this.c_title.c_th.put(['CHAT_TITLE_LIST']);
        this.c_list = new phys_Base().to(this.c_content);
        this.c_title_current = new phys_TitleRect(0xFFFFFF).to(this.c_content);
        this.c_avatar = new phys_Avatar().to(this.c_content);

        this.elements_c = U.co.multicr(phys_Frame_Chat_Menu_Element, Q.st.config.chat.buttons_max);
        this.c_list.add(this.elements_c);
        U.co.toGroup(U.arr.valuesByKey(this.elements_c, 'c_button'));

        U.ev.listenSizes(this.v, () => {
            U.ev.emitSizes(this.c_title.v, this.content_width, this.title_height);
            let elements_height = U.spread.inPlacement(1, this.elements_c, this.content_width, this.element_height, 'y');
            this.c_list.v.y = this.c_title.height + 1;
            U.ev.emitSizes(this.c_title_current.v, this.content_width, this.title_height);
            this.c_title_current.v.y = this.c_list.v.y + elements_height + 1;
            U.ev.emitSizes(this.c_avatar.v, this.content_width, this.content_height - (this.c_title_current.v.y + this.c_title_current.height));
            this.c_avatar.v.y = this.content_height - this.c_avatar.height;
        });

        U.ev.listen(Q.chat, psy_Chat.EV_CHAT_BUTTON_UPDATE, (info) => {
            this.elements_c[info.button_id].addInfo(info);
        });

        U.ev.listen(Q.player, U.text.glue([psy_Player.EV_UPD_CURRENT_PARAM, 'chat']), (chat_id) => {
            U.loop.foreach(U.arr.valuesByKey(this.elements_c, 'c_button'), (c_button) => {
                c_button.setCurrent(false);
            });
            let chat_info, c_element;
            if(chat_info = Q.chat.infos[chat_id]){
                this.c_avatar.load(chat_info.photo);
                this.c_title_current.c_th.put(Q.lang.parse(Q.chat.genName(chat_id)).toUpperCase());
                if(c_element = this.elements_c[chat_info.button_id]){
                    c_element.c_button.setCurrentInGroup();
                }
            }
        });

    }

};
