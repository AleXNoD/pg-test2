let ST = psy_Util_Co = class {

    eq(object, matrix){
		if(object){
			U.loop.foreach(matrix, (v, k) => {
				object[k] = v;
			});
			return object;
		} else return null;
	}

    ei(object, matrix){
		if(object){
			U.loop.foreach(matrix, (v, k) => {
				object[k] = (Number(object[k]) || 0) + Number(v);
			});
			return object;
		} else return null;
	}

    exe(...args){
        let func = args[0];
        args = args.slice(1);
        func && func(...args);
    }

    extenda(Child, Parent) {
		let F = function() { };
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.superclass = Parent.prototype;
	}

    async(callback, time = 0){
        let id = setTimeout(() => {
            clearTimeout(id);
            callback();
        }, time);
        return id;
    }

    multicr(cl, count){
        let elements_c = [];
        U.loop.forn(count, () => {
            elements_c.push(new cl);
        });
        return elements_c;
    }

    toGroup(elements){
        U.loop.foreach(elements, (element) => {
            element.group = elements;
        });
    }

}
