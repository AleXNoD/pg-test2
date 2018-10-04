let ST = psy_Util_Atom = class {

    constructor(){
        this.storage = {};
    }

    begin(key, callback){
        let atom = this.storage[key] || (this.storage[key] = []);
        atom.push(callback);
        atom.length == 1 && callback(key);
    }

    end(key){
        let atom = this.storage[key];
        atom.shift();
        atom.length >= 1 ? atom[0](key) : ( delete this.storage[key] );
    }

    exe(...args){
        let key = args[0];
        args = args.slice(1);
        U.co.exe(...args);
        this.end(key);
    }

}
