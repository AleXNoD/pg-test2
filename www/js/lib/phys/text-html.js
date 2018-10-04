let ST = phys_TextHTML = class extends phys_Base {

    constructor(style = {}){

        super();

        this.text = '';
        this.separator = ' ';
        this.align = ST.ALIGN_LEFT;
        this.valign = ST.VALIGN_TOP;
        this.style = style;
        this.c_content = new phys_Base().to(this);

        U.ev.listen(this.v, 'sizes', (e) => {
            this.put(this.text);
        });

    }

    put(text){
        this.text_height = 0;
        this.text = text;
        U.vis.killChildren(this.c_content.v);
        let c_line = null;
        // Получаем список форматированных элементов из html текста
        let result = U.html.parse(text);
        // Перебираем форматированные элементы
        U.loop.foreach(result, (item) => {
            // Наследуем дефолтный стиль
            let style = U.co.eq({}, this.style);
            // Переводим список тэгов в стиль
            item.tags.b && (style.fontWeight = 'bold');
            item.tags.i && (style.fontStyle = 'italic');
            item.tags.rgb && (style.fill = '#'+item.tags.rgb[0]);
            // Разделяем элемент на слова (если сепаратор пробел)
            let text_array = item.text.split(this.separator);
            // Перебираем слова и размещаем их
            U.loop.foreach(text_array, (text, n) => {
                // Добавляем пробел, если это не первый элемент
                n == 0 || (text = this.separator + text);
                // Создаём текстовый объект
                let v_tf = new PIXI.Text(text);
                v_tf.style = style;
                let metrics = PIXI.TextMetrics.measureText(text, v_tf.style, false);
                // Размещение
                if(!c_line || c_line.width + metrics.width > this.width){ // Создаём строку, если ширина превышена или это первая строка
                    this._alignLine(c_line);
                    c_line = new phys_Base().to(this.c_content);
                    c_line.v.y = Math.round(this.text_height);
                    this.text_height += metrics.height;
                } else { // Пишем в линию, если текст умещается в ней
                    v_tf.x = Math.round(c_line.width);
                }
                c_line.width += metrics.width;
                c_line.add(v_tf);
                if(item.tags.link){
                    let c_button = new phys_Button(v_tf);
                    c_button.callback = () => {
                        U.ev.emit(this.v, ST.EV_LINK, item.tags.link);
                    };
                }
                if(item.tags.u){
                    let c_underline_rect = new phys_Rect(style.fill).to(c_line);
                    U.ev.emitSizes(c_underline_rect.v, metrics.width, 1);
                    c_underline_rect.v.x = Math.round(v_tf.x);
                    c_underline_rect.v.y = Math.round(metrics.height);
                }
            });
        });
        this._alignLine(c_line);
        this._alignHeight();
    }

    editStyle(style){
        U.co.eq(this.style, style);
        this.put(this.text);
        return this;
    }

    alignment(h, v){
        this.align = h;
        this.valign = v;
        this.put(this.text);
        return this;
    }

    _alignLine(c_line){
        if(c_line){
            if(this.align == ST.ALIGN_RIGHT){
                c_line.v.x = Math.round(this.width - c_line.width);
            } else if(this.align == ST.ALIGN_CENTER){
                c_line.v.x = Math.round((this.width - c_line.width) / 2);
            }
        }
    }

    _alignHeight(){
        if(this.height && this.valign != ST.VALIGN_TOP){
            if(this.valign == ST.VALIGN_MIDDLE){
                this.c_content.v.y = Math.round((this.height - this.text_height) / 2);
            } else if(this.valign == ST.VALIGN_BOTTOM){
                this.c_content.v.y = Math.round(this.height - this.text_height);
            }
        } else this.c_content.v.y = 0;
    }

};

ST.ALIGN_LEFT = 'left';
ST.ALIGN_RIGHT = 'right';
ST.ALIGN_CENTER = 'center';
ST.VALIGN_TOP = 'top';
ST.VALIGN_MIDDLE = 'middle';
ST.VALIGN_BOTTOM = 'bottom';
ST.EV_LINK = 'c_texthtml.link';
