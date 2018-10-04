let ST = psy_Loc_Lang = class extends psy_Lang {

    constructor(){

        super();

        this.funcs = {
            chatWelcome : (chat_id, language) => {
                let info = Q.chat.infos[chat_id];
                return this.parse(this.stringify(['CHAT_BOT_WELCOME', Q.chat.genName(chat_id)]) + (info.description ? ' ' + info.description : ''), language);
            }
        };

    }

};
