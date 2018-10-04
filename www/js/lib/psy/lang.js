let ST = psy_Lang = class {

    constructor(){

        this.sym_begin = '◄';
        this.sym_sep = '•';
        this.sym_end = '►';
        this.sym_rnd = 'Ͻ';
        this.sym_lister = '-';
        this.sym_signature_sep = '/';
        this.re_pattern = /{.+?}/g;
        this.re_stringified = /◄[^◄^►]+►/g;
        this.re_sex = /([0-9]+)\/SEX\/(.*?)\/(.*)/;
        this.re_ne = /([0-9]+)\/NE\/(.*?)\/(.*?)\/(.*)/;
        this.re_func = /([0-9]+)\/FUNC\/(.*)/;

        this.language = 0;

        this.nodes = {};
        this.lists = {};
        this.funcs = {};

    }

    // Переводим данные в интерпретируемый формат
    stringify(...array){
        let result = [];
        U.loop.foreach(array, (item) => {
            if(item instanceof Array){
                let key = item[0];
                let parameters = item.slice(1, item.length);
                U.loop.foreach(parameters, (parameter, n) => {
                    parameters[n] = this.stringify(parameter);
                });
                result.push(this.sym_begin + key + (parameters.length ? this.sym_sep + parameters.join(this.sym_sep) : '') + this.sym_end);
            } else result.push(item);
        });
        return result.join('');
    }

    genShufflePostfix(){
        return this.sym_rnd + U.calc.random(10000, 99999);
    }

    // Парсер, преобразовать маркированный текст в переведённый текст
    parse(text, language = 0){
        language === 0 && (language = this.language);
        text = text instanceof Array ? this.stringify(text) : String(text);
        let matched = text.match(this.re_stringified);
        if(matched && matched.length){
            U.loop.foreach(matched, (item) => {
                let item_cut = item.substr(1, item.length - 2);
                let item_array = item_cut.split(this.sym_sep);
                let item_key_array = item_array[0].split(this.sym_rnd);
                let item_parameters = item_array.slice(1, item_array.length);
                let transmuted = this.transmute(item_key_array[0], item_parameters, language, item_key_array[1] || 0);
                text = U.text.replace(text, item, transmuted);
            });
            return this.parse(text, language);
        } else return text;
    }

    // Добавить ключ-значение
    add(key, text, language = null){
        // Добавить в ноду
        key = String(key);
        let text_array = text instanceof Array ? text : [String(text)];
        U.loop.forn(text_array.length, (n) => {
            let item = text_array[n];
            let item_new = text_array[n] = { parts : item.split(this.re_pattern), markers : item.match(this.re_pattern) || [] };
            U.loop.forn(item_new.markers.length, (u) => {
                let marker = item_new.markers[u];
                item_new.markers[u] = this.genMarker(marker.substr(1, marker.length - 2));
            });
        });
        let signature = this.genSignature(key, language || this.language);
        this.nodes[signature] = text_array;
        // Добавить в список
        if(key.indexOf(this.sym_lister) >= 0){
            let [key_name, key_number] = key.split(this.sym_lister);
            let list = this.lists[key_name] || (this.lists[key_name] = {});
            list[key_number] = true;
        }
        return this;
    }

    // Преобразовать ключ с переменными в текст
    transmute(key, parameters = [], language = 0, random = 0){
        let node = this.nodes[this.genSignature(key, language)] || this.nodes[this.genSignature(key, 1)] || this.nodes[this.genSignature(key, 0)];
        if(node){
            if(node instanceof Function){
                return node(language, parameters);
            } else {
                node = node.length == 1 ? node[0] : U.arr.random(node, random);
                return node.parts.length == 1 ? node.parts[0] : this.joinParts(node.parts, node.markers, parameters, language);
            }
        } else return '';
    }

    // Соединить части
    joinParts(parts, markers, parameters, language){
        let result = '';
        U.loop.forn(parts.length, (n) => {
            result += parts[n] + (n == parts.length - 1 ? '' : (this.transmuteMarker(markers[n], parameters, language)));
        });
        return result;
    }

    genMarker(text){
        if(Number(text) == text){
            return { type : ST.MARKER_TYPE_VAR, parameter_key : text };
        } else if(this.re_ne.test(text)){
            let [parameter_key, replace1, replace2, replace3] = this.re_ne.exec(text).slice(1);
            return { type : ST.MARKER_TYPE_NE, parameter_key : parameter_key, replaces : [replace1, replace2, replace3] };
        } else if(this.re_sex.test(text)){
            let [parameter_key, replace1, replace2] = this.re_sex.exec(text).slice(1);
            return { type : ST.MARKER_TYPE_SEX, parameter_key : parameter_key, replaces : [replace1, replace2] };
        } else if(this.re_func.test(text)){
            let [parameter_key, func_name] = this.re_func.exec(text).slice(1);
            return { type : ST.MARKER_TYPE_FUNC, parameter_key : parameter_key, func_name : func_name };
        }
    }

    // Преобразовать маркер в текст
    transmuteMarker(marker, parameters, language){
        let parameter = parameters[marker.parameter_key];
        if(marker.type == ST.MARKER_TYPE_VAR){
            return String(parameter);
        } else if(marker.type == ST.MARKER_TYPE_NE){
            return String(U.text.grammarNe(parameter, marker.replaces[0], marker.replaces[1], marker.replaces[2]));
        } else if(marker.type == ST.MARKER_TYPE_SEX){
            return String(U.text.grammarSex(parameter, marker.replaces[0], marker.replaces[1]));
        } else if(marker.type == ST.MARKER_TYPE_FUNC){
            return this.funcs[marker.func_name] ? String(this.funcs[marker.func_name](parameter, language)) : '';
        }
    }

    // Получить сигнатуру элемента key+language
    genSignature(key, language){
        return key + this.sym_signature_sep + language;
    }

    // Получить локализованный список
    getList(key, parameters = [], language = 0){
        let list_numbers = this.lists[key];
        let result = {};
        if(list_numbers){
            U.loop.foreach(list_numbers, (number) => {
                result[number] = this.transmute(key + this.sym_lister + number, parameters, language);
            });
            return result;
        } else return result;
    }

    // Скушать языковой файл, где есть список ключей и значений
    addFileData(data, language = null){
        data = data.split('\r\n');
        U.loop.foreach(data, (item) => {
            if(item && item.indexOf('//') !== 0){
                let pos = item.indexOf(' ');
                if(pos > 0){
                    let key = item.substr(0, pos);
                    let text = item.substr(pos + 1);
                    this.add(key, text, language);
                }
            }
        });
    }

};

ST.MARKER_TYPE_VAR = 1;
ST.MARKER_TYPE_NE = 2;
ST.MARKER_TYPE_SEX = 3;
ST.MARKER_TYPE_FUNC = 4;
