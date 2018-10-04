let ST = psy_Util_HTML = class {

    constructor(){
        this.re_tag = /<(([^ ]+?)(?:.*?))>(.*?)<\/\2>/g;
    }

    parse(text, result = [], tags = {}){
        let first_tag_index = text.indexOf('<');
        if(first_tag_index !== -1){
            let caret = 0, li, r;
            this.re_tag.lastIndex = 0;
            while(r = this.re_tag.exec(text)){
                // Пихаем что было ПЕРЕД тегом но С каретки
                this._addToResult(result, text.slice(caret, r.index), tags);
                // Обработка тега
                let tag = r[1].split(' ');
                let tags_new = U.arr.clone(tags);
                tags_new[tag[0]] = tag.length == 1 ? true : tag.slice(1);
                li = this.re_tag.lastIndex;
                this.parse(r[3], result, tags_new);
                caret = this.re_tag.lastIndex = li;
            }
            // Пихаем текст после последнего тега
            this._addToResult(result, text.slice(caret), tags);
        } else this._addToResult(result, text, tags);
        return result;
    }

    _addToResult(result, text, tags){
        text.length && result.push({text, tags});
    }

}
