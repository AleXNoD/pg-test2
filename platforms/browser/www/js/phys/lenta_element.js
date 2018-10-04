let ST = phys_Lenta_Element = class extends phys_Base {

    constructor(){

        super();

        this.c_avatar = new phys_Loc_Avatar(0).to(this);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_avatar.v, this);
        });

        U.ev.listen(this.v, phys_Roll.EV_ITEM, (item) => {
            let info = Q.user.getPlayerInfo(item.player_id);
            this.c_avatar.load(info.photo);
            this.width = 65;
        });

    }

};
