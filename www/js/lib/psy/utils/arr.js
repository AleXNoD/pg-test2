let ST = psy_Util_Arr = class {

    keyalize(key, value){
		let index = { };
		index[key] = value;
		return index;
	}

    fillArray(item, count){
        let array = [];
        U.loop.forn(count, () => {
            array.push(item);
        });
        return array;
    }

    deleteByValue(array, key, value){
        let n = 0;
        while(n < array.length){
            if(array[n][key] == value){
                array.splice(n, 1);
            } else n++;
        }
        return array;
    }

    deleteByType(array, cl){
        let n = 0;
        while(n < array.length){
            if(array[n] instanceof cl){
                array.splice(n, 1);
            } else n++;
        }
        return array;
    }

    minBinaural(array){
        return array[0] < array[1] ? [array[0], array[1]] : [array[1], array[0]];
    }

    last(array){
		return array.length == 0 ? null : array[array.length - 1];
	}

    forceMake(object){
        return object instanceof Array ? object : [object];
    }

	first(array){
		return array.length == 0 ? null : array[0];
	}

    clone(array){
        return array instanceof Array ? array.slice(0) : U.co.eq({}, array);
	}

    testValueExists(value, array){
        for (let v in array) {
			if (value == array[v]) {
				return true;
			}
		}
		return false;
    }

    keys(array){
        let keys = [];
        U.loop.foreach(array, (v, k) => {
            keys.push(k);
        });
        return keys;
    }

    keysLength(array){
        return this.keys(array).length;
    }

    values(array){
        let values = [];
		U.loop.foreach(array, (v, k) => {
			values.push(v);
		});
		return values;
    }

    swap(array){
        let index = {};
        U.loop.foreach(array, (v, k) => {
            index[v] = k;
        });
        return index;
    }

    valuesByKey(array, key){
        let values = [];
        U.loop.foreach(array, (v, k) => {
            values.push(v[key]);
        });
        return values;
    }

    valuesToKeys(array, value = true){
        let index = {};
        U.loop.foreach(array, (v, k) => {
            index[v] = value;
        });
        return index;
    }

    valuesCounterize(array){
        let object = { };
		U.loop.foreach(array, (v) => {
			object[v] ? (object[v]++) : (object[v] = 1);
		});
		return object;
    }

    uniques(array){
        return this.keys(this.valuesToKeys(array));
    }

    random(array, random = Math.random()){
		return array[Math.floor(array.length * random)];
	}

    shuffle(){
        for(let j, x, i = array.length; i; j = parseInt((Math.random()-0.000000001) * i), x = array[--i], array[i] = array[j], array[j] = x);
        return array;
    }

    sortByParameter(array, key) {
		array.sort((a, b) => {
			if (a[key] < b[key]) {
				return -1;
			} else if (a[key] > b[key]) {
				return 1;
			} else return 0;
		});
		return array;
	}

    sumValues(array, key){
		let sum = 0;
		if(key){
			U.loop.foreach(array, (v, k) => {
				sum += v[key];
			});
		} else {
			U.loop.foreach(array, (v, k) => {
				sum += v;
			});
		}
		return sum;
	}

    select(array, callback){
		let result = [];
		U.loop.foreach(array, (item) => {
			callback(item) && result.push(item);
		});
		return result;
	}

}
