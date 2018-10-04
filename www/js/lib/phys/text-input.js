let ST = phys_TextInput = class extends phys_Base {

    constructor(style = null){

        super();

        this.selection = false;
        this.symbols = [];
        this.style = new PIXI.TextStyle();

        this.c_roll = new phys_Roll(phys_TextInput_Element, phys_Roll.ORIENTATION_X).to(this);
        this.c_roll.alignment = phys_Roll.ALIGNMENT_TOP;
        this.c_roll.mouse_mode = phys_Roll.MOUSE_MODE_SELECTION;
        this.c_roll.replaceItems(this.symbols);
        this.c_caret = new phys_TextInput_Caret().to(this.c_roll.c_container_above);
        this.v.interactive = true;
        this.v.cursor = 'text';

        // Перехватываем вводимый текст
        this.evi_input = U.ev.listen(U.control.ee, psy_Util_Control.EV_INPUT, (text) => {
            if(this.c_roll.focus){
                this.put(text);
                U.ev.emit(this.v, ST.EV_INPUT);
            }
        });

        // Перехватываем копирование
        this.evi_copy = U.ev.listen(U.control.ee, psy_Util_Control.EV_COPY, (callback) => {
            if(this.c_roll.focus){
                callback(this.getSelectedText());
            }
        });

        // Перехватываем вырезание
        this.evi_cut = U.ev.listen(U.control.ee, psy_Util_Control.EV_CUT, (callback) => {
            if(this.c_roll.focus){
                callback(this.getSelectedText());
                this.put([]);
            }
        });

        // Бакспэйс и делет
        this.evi_key = U.ev.listen(U.control.ee, psy_Util_Control.EV_KEY, (e) => {
            if(this.c_roll.focus){
                if(e.code == 8){ // backspace
                    if(this.c_roll.selected[0] == this.c_roll.selected[1] && this.c_roll.selected[0] != 0){
                        this.c_roll.select(this.c_roll.selected[0] - 1, this.c_roll.selected[1]);
                    }
                    this.put([]);
                } else if(e.code == 46){ // del
                    if(this.c_roll.selected[0] == this.c_roll.selected[1] && this.c_roll.selected[1] != this.c_roll.items.length){
                        this.c_roll.select(this.c_roll.selected[0], this.c_roll.selected[1] + 1);
                    }
                    this.put([]);
                } else if(e.code == 37){ // left
                    this.selectByArrows(-1, e.shift ? true : false);
                } else if(e.code == 39){ // right
                    this.selectByArrows(1, e.shift ? true : false);
                } else if(e.code == 65){ // ctrl+a
                    e.ctrl && this.c_roll.select(0, this.c_roll.items.length);
                } else if(e.code == 13){ // enter
                    U.ev.emit(this.v, ST.EV_ENTER);
                }
            }
        });

        // Удаление объекта
        U.ev.listen(this.v, 'kill', () => {
            U.ev.removeEvi(this.evi_input);
            U.ev.removeEvi(this.evi_key);
            U.ev.removeEvi(this.evi_cut);
            U.ev.removeEvi(this.evi_copy);
        });

        // Действия на каждый добавляемый элемент
        U.ev.listen(this.c_roll.v, phys_Roll.EV_CREATE, (e) => {
            e.c.c_tf.editStyle(this.style); // стиль
            e.c.fill = this.style.fill; // цвет
        });

        // Фокус и селекция
        U.ev.listen(this.c_roll.v, phys_Roll.EV_SELECTION, () => {
            this.drawCaret();
        });

        // Ловим размеры
        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_roll.v, this);
            U.ev.emitSizes(this.c_caret.v, 1, this.height);
        });

        style && this.editStyle(style);
        this.drawCaret();

    }

    editStyle(style){
        U.co.eq(this.style, style);
        return this;
    }

    // Отрисовать положение и видимость каретки на основе текущего выделения
    drawCaret(){

        // Алгоритм выравнивания и подгонки под курсор (работает только когда нет режима выделения)
        if(!this.c_roll.selecting && this.c_roll.focus){
            let n_left = this.c_roll.selected[this.c_roll.last_changed_select_side] - 1;
            let n_right = this.c_roll.selected[this.c_roll.last_changed_select_side] - 1;
            if(n_right > this.c_roll.item_n.down - 2){
                this.c_roll.scrollBottom(n_right + 10);
            } else if(n_left < this.c_roll.item_n.up + 2){
                this.c_roll.scrollTop(n_left - 10);
            }
        }

        // Собственно, отрисовка
        let n = this.c_roll.selected[0] - 1;
        let onesel = this.c_roll.selected[0] == this.c_roll.selected[1];
        if(n < 0){
            this.c_caret.visual(this.c_roll.focus && onesel ? true : false);
            this.c_caret.v.x = -this.c_roll.scroll_position;
        } else {
            let c_element = this.c_roll.elements_c[n];
            this.c_caret.visual(this.c_roll.focus && onesel && (c_element || this.c_roll.items.length == 0) ? true : false);
            this.c_caret.v.x = c_element ? Math.round(c_element.v.x + c_element.width) - 1 : 0;
        }

    }

    // Выбираем сдвигом
    selectByArrows(delta, selection){
        if(selection){
            this.c_roll.selected[0] == this.c_roll.selected[1] && (this.c_roll.setSelAxis(this.c_roll.selected[0]));
            this.c_roll.selectUseSelAxis(this.c_roll.selected[this.c_roll.sel_axis == this.c_roll.selected[0] ? 1 : 0] + delta);
        } else {
            this.c_roll.select(this.c_roll.selected[delta < 0 ? 0 : 1] + (this.c_roll.selected[0] == this.c_roll.selected[1] ? delta : 0));
        }
        this.drawCaret();
    }

    // Получить выбранный текст
    getSelectedText(){
        if(this.c_roll.selected[0] != this.c_roll.selected[1]){
            return this.c_roll.items.slice(this.c_roll.selected[0], this.c_roll.selected[1]).join('');
        } else return '';
    }

    // Получить текст
    getText(){
        return this.c_roll.items.join('');
    }

    // Вставка букв
    put(text){

        // При необходимости преобразуем входящий текст в массив
        let array;
        if(text instanceof Array){
            array = text;
        } else {
            array = [];
            U.loop.forn(text.length, (n) => {
                array.push(text.charAt(n));
            });
        }

        // Вставка символов в массив и сдвиг курсора при необходимости
        this.symbols.splice(this.c_roll.selected[0], this.c_roll.selected[1] - this.c_roll.selected[0], ...array);
        this.c_roll.select(this.c_roll.selected[0] + array.length);
        this.c_roll.draw();

        // Рисуем каретку
        this.drawCaret();

    }

    // Обнулить
    clear(){
        this.symbols.splice(0, this.symbols.length);
        this.c_roll.selectFirst();
        this.c_roll.draw();
        this.drawCaret();
    }

};

ST.EV_ENTER = 'c_textinput.enter';
ST.EV_INPUT = 'c_textinput.input';
