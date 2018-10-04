let ST = psy_Chat = class extends psy_EventEmitter {

    constructor(){
        super();
        this.infos = {};
    }

    genName(id){
        let chat = this.parseId(id);
        if (chat.type == Q.st.config.chat.type.main) {
            return ['CHAT-' + chat.target];
        } else if (chat.type == Q.st.config.chat.type.city) {
            return ['CITY-' + chat.target];
        } else if (chat.type == Q.st.config.chat.type.country) {
            return ['COUNTRY-' + chat.target];
        } else if (chat.type == Q.st.config.chat.type.mafia) {
            return ['MAFIA_CHAT', chat.target];
        } else if(chat.type == Q.st.config.chat.type.team){
            return ['TEAM_CHAT', chat.target];
        }
    }

    parseId(id){
        let target = id % Q.st.config.chat.numdec;
		var type = Math.floor(id / Q.st.config.chat.numdec);
		return { type, target };
    }

    stringifyId(type, target){
        return type * M.st.config.chat.numdec + Number(target);
    }

    enter(id, callback = null){
        Q.wscon.sr('enter_chat', { chat_id : id }).cb(() => {
            U.co.exe(callback);
        });
    }

    sendMessageSafe(message, callback = null){
        this.sendMessage(message, callback);
    }

    sendMessage(message, callback = null){
        Q.wscon.sr('send_chat_message', { message : message, to_player_id : 0 }).cb(callback);
    }

    addInfo(id, new_info){
        let info = this.infos[id] || (this.infos[id] = {});
        info.id = id;
        U.co.eq(info, new_info);
        new_info.button_id && U.ev.emit(this, ST.EV_CHAT_BUTTON_UPDATE, info);
    }

};

ST.EV_CHAT_BUTTON_UPDATE = 'm_chat.chat_button_update';
