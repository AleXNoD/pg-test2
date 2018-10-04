let ST = psy_Util_JSON = class {

    decode(text){
        let dm = null;
        try {
            dm = JSON.parse(text);
        } catch(e){};
        return dm;
	}

    encode(object){
        return JSON.stringify(object);
    }

}
