let ST = psy_Util_Loop = class {

    foreach(array, callback, breakable = false){
        if(breakable){
			for(let k in array){
				if(callback(array[k], k) === false){
					break;
				}
			}
		} else {
			for(let k in array){
				callback(array[k], k);
			}
		}
	}

    foreachSome(array, callback){
        array instanceof Array || (array = [array]);
		this.foreach(array, callback);
        return array;
    }

    forn(limit, callback, period = 1){
        for(let i=0; i<limit; i+=period){
			callback(i);
		}
    }

    ford(a, b, callback){
        this.forn(Number(b) - Number(a) + 1, (n) => {
            callback(Number(n) + Number(a));
        });
    }

}
