let ST = psy_Storage = class extends psy_EventEmitter {

    constructor(){

        super();

        this.config = {};
        this.player_id = 0;
        this.transfers = [];

    }

};

ST.EV_CONFIG = 'm_storage.config';
