let ST = psy_Util_Asyone = class {

    constructor(){
        this.callbacks = {};
        this.processing = {};
        this.unique_key_counter = 0;
    }

    addCallback(callback){
        let key = '_unique'+(++this.unique_key_counter);
        this.callbacks[key] = callback;
        return key;
    }

    process(key){
        if(!this.processing[key] && this.callbacks[key]){
            this.processing[key] = true;
            U.co.async(() => {
                U.co.exe(this.callbacks[key]);
                delete this.processing[key];
            });
        }
    }

}
