let ST = psy_Util_Text = class {

    replace(text, search, replace){
		return text.split(search).join(replace);
	}

    repeat(text, count){
        let result = '';
        U.loop.forn(count, () => {
            result += text;
        });
        return result;
    }

    glue(parts, separator = '-'){
        return parts.join(separator);
    }

    simplify(text){
        text = String(text);
        let array = text.match(/[a-zа-я0-9]+/gi);
        return array ? array.join('') : '';
    }

    // Из каши привести текст в нормыльный вид - убрать UTF и HTML замены
    normalize(text){
        text = String(text);
        text = this.desafeUTF(text);
        text = this.decodeHTML(text);
        return text;
    }

    decodeHTML(text){
        text = String(text);
        text = this.replace(text, '&lt;', '<');
        text = this.replace(text, '&gt;', '>');
        text = this.replace(text, '&#092;', '\\');
        text = this.replace(text, '&#039;', '\'');
        text = this.replace(text, '&#034;', '"');
        text = this.replace(text, '&#94;', '^');
        text = this.replace(text, '&amp;', '&');
        return text;
    }

    safeUTF(text){
        text = String(text);
		text = this.replace(text, '&', '₰');
		text = this.replace(text, '\'', 'ʹ');
		text = this.replace(text, '"', 'ʺ');
		text = this.replace(text, '<', '˂');
		text = this.replace(text, '>', '˃');
		text = this.replace(text, '`', 'ʹ');
		text = this.replace(text, '\\', '۱');
		text = this.replace(text, '^', '˄');
		text = this.replace(text, "\n", '');
		text = this.replace(text, "\r", '');
		text = this.replace(text, '\x00', '');
		text = this.replace(text, '\x1a', '');
		text = this.replace(text, '∫', '');
		text = this.replace(text, '•', '');
		text = this.replace(text, '‘', '');
		text = this.replace(text, '’', '');
		return text;
    }

    desafeUTF(text){
        text = String(text);
		text = this.replace(text, '₰', '&');
		text = this.replace(text, 'ʹ', '\'');
		text = this.replace(text, 'ʺ', '"');
		text = this.replace(text, '˂', '<');
		text = this.replace(text, '˃', '>');
		text = this.replace(text, 'ʹ', '`');
		text = this.replace(text, '۱', '\\');
        return text;
    }

    parseNumSequence(text, begin_min = 0, end_max = 999){
		let sequence = [];
		U.loop.foreach(text.split(','), (num) => {
			let numd = num.split('-');
			numd[0] = Number(numd[0]);
			numd.length == 2 && (numd[1] = Number(numd[1]));
			numd[0] < begin_min && (numd[0] = begin_min);
			numd.length == 2 && numd[1] > end_max && (numd[1] = end_max);
			if(numd.length == 2 && numd[0] < numd[1]){
				U.loop.ford(numd[0], numd[1], (n) => {
					sequence.push(n);
				});
			} else sequence.push(numd[0]);
		});
		return sequence;
	}

	parceSequenceDH(text){
		let result = [];
		U.loop.foreach(text.split(';'), (element) => {
			try {
				let node = element.split('/');
				let days = this.parseNumSequence(node[0], 1, 7);
				let hours = this.parseNumSequence(node[1], 0, 23);
				U.loop.foreach(days, (day) => {
					U.loop.foreach(hours, (hour) => {
						result.push([day, hour]);
					});
				});
			} catch (e) {};
		});
		return result;
	}

    grammarNe(number, a, b, c){
        number = String(number);
        let e1 = number.substr(-1, 1);
        let e2 = number.substr(-2, 2);
        if (e2 == 11 || e2 == 12 || e2 == 13 || e2 == 14) {
            return c;
        } else if (e1 == 1) {
            return a;
        } else if (e1 == 2 || e1 == 3 || e1 == 4) {
            return b;
        } else return c;
    }

    grammarSex(sex, a = null, b = null, c = null){
        sex = Number(sex);
        return sex == 1 ? a : (sex == 2 ? b : c);
    }

    symBefore(text, length = 2, sym = '0'){
        text = String(text);
        let len = length - text.length;
        len > 0 && (text = this.repeat(sym, len) + text);
        return text;
    }

}
