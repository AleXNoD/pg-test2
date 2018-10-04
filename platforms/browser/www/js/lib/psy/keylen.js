let ST = psy_Keylen = class extends psy_EventEmitter {

    constructor(){
        super();
        this.keys = {};
        this.count = 0;
    }

    add(key, value){
        if(value){
            if(!this.keys[key]){
                this.count++;
                this.emitUpdate();
            }
            this.keys[key] = value;
            return value;
        } else {
            if(this.keys[key]){
                this.count--;
                delete this.keys[key];
                this.emitUpdate();
            }
            return 0;
        }
    }

    get(key){
        return this.keys[key] || 0;
    }

    emitUpdate(){
        U.ev.emit(this, ST.EV_UPDATE, this.count);
    }

};

ST.EV_UPDATE = 'm_keylen.update';
