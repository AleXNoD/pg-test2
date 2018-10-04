let ST = psy_User = class {

    constructor(){
        this.storage = { [ST.PLAYER] : {}, [ST.SOCIAL] : {} };
    }

    create(){
        return {
            id : null,
            info : {},
            assoc : null
        };
    }

    exists(user, type){
        return this.storage[type][user_id] ? true : false;
    }

    get(user_id, type){
        let user = this.storage[type][user_id] || (this.storage[type][user_id] = this.create());
        return user;
    }

    getPlayerInfo(player_id){
        return this.get(player_id, ST.PLAYER).info;
    }

    getSocialInfo(social_id){
        return this.get(social_id, ST.SOCIAL).info;
    }

    add(user_id, type, info = {}){
        user_id = Number(user_id);
        let user = this.get(user_id, type);
        user.id = user_id;
        U.co.eq(user.info, info);
        return user;
    }

    link(player_id, social_id){
        let player = this.get(Number(player_id), ST.PLAYER);
        let social = this.get(Number(social_id), ST.SOCIAL);
        player.assoc = social;
        social.assoc = player;
    }

};

ST.PLAYER = 'player';
ST.SOCIAL = 'social';
