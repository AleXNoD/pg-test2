let ST = phys_Messages_Element = class extends phys_Base {

    constructor(){

        super();

        this.c_th = new phys_Loc_TextHTML(14, 0x000000, 'left', 'middle').to(this);
        this.split_height = 50;
        this.split_font_size = 18;

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_th.v, this.width);
        });

        U.ev.listen(this.v, phys_Roll.EV_ITEM, (post) => {
            let text = '', text_time, text_name, text_name_from, text_name_to, text_message;
            if(post.split){
                text = Q.lang.parse(post.split);
                this.c_th.editStyle({ fontSize : this.split_font_size });
                this.c_th.v.x = 50;
                U.ev.emitSizes(this.c_th.v, null, this.split_height);
                this.c_th.put(text);
                this.height = this.split_height;
            } else {
                text_time = '<rgb 777777>[' + U.time.toTextHM(post.time) + ']</rgb>';
                text_message = Q.lang.parse(post.message);
                if(!post.service){
                    text_name_from = post.agent_id ? Q.lang.stringify(['POWER_ANON', post.agent_id]) : Q.player.genName(post.player_id, true, true);
                    if(post.to_player_id){
                        if(post.to_player_id == Q.st.player_id){
                            text_message = '<b>' + text_message + '</b>';
                            if(post.personal){
                                text_name = text_name_from + ' ' + Q.lang.stringify(['MESSAGE_WRITE_PERSONAL_ME']);
                            } else text_name = text_name_from + ' ' + Q.lang.stringify(['MESSAGE_WRITE_ME']);
                        } else {
                            text_name_to = Q.player.genName(post.to_player_id, true, true);
                            text_name = text_name_from + ' ' + Q.lang.stringify(['MESSAGE_WRITE_FOR']) + ' ' + text_name_to;
                        }
                    } else text_name = text_name_from;
                    text = text_time + ' ' + text_name + ' : ' + text_message;
                } else {
                    text = text_time + ' ' + text_message;
                }
                this.c_th.put(text);
                this.height = this.c_th.text_height;
            }
        });

    }

};
