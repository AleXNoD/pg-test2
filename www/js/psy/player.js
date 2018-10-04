let ST = psy_Player = class extends psy_EventEmitter {

    constructor(){
        super();
    }

    addInfos(infos){

        let change_onlines = [];

        U.loop.foreach(infos, (info, player_id) => {

            Q.user.add(player_id, psy_User.PLAYER, info);
            info.social_id && Q.user.link(player_id, info.social_id);

            if(player_id == Q.st.player_id){ // Если параметры текущего игрока
                U.loop.foreach(info, (value, key) => {
                    U.ev.emit(this, U.text.glue([ST.EV_UPD_CURRENT_PARAM, key]), value);
                });
            }

            if(info.online !== undefined){
                change_onlines.push(player_id);
            }

            U.ev.emit(this, ST.EV_UPD_PLAYER, player_id);

        });

        change_onlines && U.ev.emit(this, ST.EV_UPD_ONLINES, change_onlines);

    }

    genName(player_id, link = true, bold = true){

        let info = Q.user.get(player_id, psy_User.PLAYER).info;
        let text = info.name;

        text = '<rgb '+info.rgb+'>'+text+'</rgb>';
        bold && (text = '<b>'+text+'</b>');
        link && (text = '<link player '+player_id+'>'+text+'</link>');

        return text;

    }

};

ST.EV_UPD_CURRENT_PARAM  = 'm_player.upd_current_param';
ST.EV_UPD_PLAYER  = 'm_player.upd_player';
ST.EV_UPD_ONLINES  = 'm_player.upd_player';
