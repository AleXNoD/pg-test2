let ST = phys_Roll = class extends phys_Base {

    constructor(class_c, orientation){

        super();

        this.class_c = class_c;

        this.alignment = ST.ALIGNMENT_BOTTOM;
        this.orientation = orientation;

        this.mouse_mode = ST.MOUSE_MODE_SCROLL;
        this.force_align_top_if_not_full = true; // если экран заполнен не до конца, формируем выравнивание по top
        this.scroll_start_ev_need_delta = 0;

        this.scrolling = false;
        this.scroll_factor = 0; // скорость анимации прокрутки
        this.scroll_size = 0;

        this.scroll_sel_speed = 0;
        this.scroll_sel_speed_max = 4;
        this.scroll_sel_percent = 0.2;
        this.scroll_sel_timer = new psy_Timer(200);

        this.selecting = false;
        this.last_changed_select_side = 0;
        this.selected = [0, 0];
        this.sel_axis = 0;

        this.slide_speed = 0;
        this.slide_fading_factor = 0.95;

        this.animation_callback = null;

        this.slowdown_scroll_aim = null; // на сколько px делать анимацию затухания
        this.slowdown_factor = 6;

        this.scroll_tick_callback = null;

        this.extra_fringes_size = 0; // расширенные границы для большего рендеринга, рендерим пачкой

        this.elements_c = {};
        this.items = [];

        this.class_c; // класс элемента, обрабатывающего item
        this.item_n = null; // текущий верхний и нижний элемент items; down и up
        this.fringes = null; // down и up; верхняя и нижняя граница массива элементов
        this.container_height = 0; // разница между верхней и нижней границей
        this.endlock_status; // блокировка в связи с достижением верхней или нижней границы
        this.scroll_position = 0; // позиция прокрутки
        this.ori_key_pos = this.orientation == ST.ORIENTATION_X ? 'x' : 'y';
        this.ori_key_size = this.orientation == ST.ORIENTATION_X ? 'width' : 'height';

        this.c_rect = new phys_Rect(0, 0, null, 0).to(this); // v_bg
        this.c_container = new phys_Base().to(this); // v_container
        this.c_container_above = new phys_Base().to(this); // v_container

        this.c_over_detector = new phys_OverDetector(this.v);
        this.c_move_detector = new phys_MoveDetector(this);

        this.v.interactive = true;

        new phys_Mask(this.v, phys_Mask.MODE_RECT);

        // Прокрутка
        this.c_move_detector.callback = (delta, delta_full) => {
            this.scroll(delta[this.ori_key_pos]); // если есть движение, выполняем прокрутку на разницу
            this.slide_speed = delta[this.ori_key_pos];
        };

        // Делаем прокрутку при нажатии
        U.ev.listen(this.v, ['mousedown', 'tap'], () => {
            this.focus = true;
            U.ev.emit(this.v, ST.EV_FOCUS);
            if(this.mouse_mode == ST.MOUSE_MODE_SCROLL){
                this.stopAnimation();
                this.slide_speed = 0;
                this.scrolling = true;
                this.c_move_detector.start();
            } else if(this.mouse_mode == ST.MOUSE_MODE_SELECTION){
                this.selectBySelecting(this.getItemByMouse());
                this.scroll_sel_timer.start();
                this.removeTick(this._scroll_sel_tick);
                this._scroll_sel_tick = this.ticker(() => {
                    this.selected[0] != this.selected[1] && this.scroll(this.scroll_sel_speed);
                });
                this.scroll_sel_timer.callback = () => {
                    this.selectUseSelAxis(this.getItemByMouse());
                };
            }
        });

        // При клике в любое место (кроме текстового поля) снимаем фокус
        this.evi_mousedown_outside = U.ev.listen(document, 'mousedown', () => {
            if(!this.c_over_detector.over){
                if(this.focus){
                    this.focus = false;
                    U.ev.emit(this.v, ST.EV_FOCUS);
                    this.emitSelections();
                }
            }
        });

        // Прокрутка
        this.evi_wheel = U.ev.listen(U.control.ee, psy_Util_Control.EV_WHEEL, (delta) => {
            if(this.c_over_detector.over){
                this.slide_speed += delta * 3;
                this.startSlide();
            }
        });

        // При отпускании мышки или пальца деактивируем прокрутку
        this.evi_mouseup = U.ev.listen(document, 'mouseup', () => {
            if(this.mouse_mode == ST.MOUSE_MODE_SCROLL){
                this.scrolling = false;
                this.c_move_detector.stop();
                U.ev.emit(this.v, ST.EV_MANUAL_SCROLL_END);
                this.startSlide();
            } else if(this.mouse_mode == ST.MOUSE_MODE_SELECTION){
                this.selecting = false;
                this.removeTick(this._scroll_sel_tick);
                this.scroll_sel_timer.stop();
            }
        });

        // При перемещении мышки при необходимости выделяем
        this.evi_mousemove = U.ev.listen(document, 'mousemove', () => {
            if(this.mouse_mode == ST.MOUSE_MODE_SELECTION && this.selecting){
                this.selectUseSelAxis(this.getItemByMouse());
                this.setScrollSelSpeedByMouse();
            }
        });

        // Ловим размеры
        U.ev.listen(this.v, 'sizes', () => {

            U.ev.emitSizes(this.c_rect.v, this);

            // Коррекция fringes и scroll
            if(this.alignment == ST.ALIGNMENT_BOTTOM){
                this.scroll_position = Math.max((this.fringes.down + this.scroll_position) - this['prev_' + this.ori_key_size], 0);
                this.fringes.down = this[this.ori_key_size];
            } else if(this.alignment == ST.ALIGNMENT_TOP){
                this.scroll_position = Math.min(this.fringes.up + this.scroll_position, 0);
                this.fringes.up = 0;
            }

            this.draw();
            U.ev.emit(this.v, ST.EV_CHANGE);

        });

        // Перемещаем контейнеры в соответствии со scroll_position
        U.ev.listen(this.v, ST.EV_CHANGE, () => {
            this.c_container.v[this.ori_key_pos] = this.scroll_position;
            this.c_container_above.v[this.ori_key_pos] = this.scroll_position;
        });

        // Деструктор
        U.ev.listen(this.v, 'kill', () => {
            U.ev.removeEvi(this.evi_mouseup);
            U.ev.removeEvi(this.evi_mousemove);
            U.ev.removeEvi(this.evi_mousedown_outside);
            this.scroll_sel_timer.stop();
            this.removeTick(this._scroll_sel_tick);
        });

        this.terminate();

    }

    // ANIMATION

    startSlide(){
        if(this.slide_speed){
            this.removeTick(this.animation_callback);
            this.animation_callback = this.ticker(() => {
                this.slide_speed *= this.slide_fading_factor;
                this.scroll(this.slide_speed);
                if(Math.abs(this.slide_speed) <= 0.2){
                    this.removeTick(this.animation_callback);
                }
            });
        }
    }

    startSlowdown(){
        if(this.slowdown_scroll_aim !== null){
            this.removeTick(this.animation_callback);
            this.animation_callback = this.ticker(() => {
                let speed = (this.slowdown_scroll_aim - this.scroll_position) / this.slowdown_factor;
                if(Math.abs(speed) <= 0.2){
                    this.scroll_position = this.slowdown_scroll_aim;
                    this.scroll(0);
                    this.removeTick(this.animation_callback);
                    this.slowdown_scroll_aim = null;
                } else this.scroll(speed);
            });
        }
    }

    stopAnimation(){
        this.slide_speed = 0;
        this.removeTick(this.animation_callback);
    }

    // ITEMS

    // Добавить item в конец списка
    addItemToEnd(item){
        let items = item instanceof Array ? item : [item];
        this.items.push(...items);
        this.drawDown();
    }

    // Добавить item в начало списка
    addItemToStart(item){
        let items = item instanceof Array ? item : [item];
        this.items.unshift(...items);
        this.item_n.up += items.length;
        this.item_n.down += items.length;
        let elements_c_new = {};
        U.loop.foreach(this.elements_c, (c_element, n) => {
            elements_c_new[n + items.length] = c_element;
        });
        this.elements_c = elements_c_new;
        this.drawUp();
    }

    // Перезаписать items
    replaceItems(items){
        items !== null && (this.items = items);
        this.draw();
        U.ev.emit(this.v, ST.EV_CHANGE);
    }

    // Получить первый элемент
    getFirstElement(){
        return this.elements_c[this.item_n.up] || null;
    }

    // Получить последний элемент
    getLastElement(){
        return this.elements_c[this.item_n.down] || null;
    }

    // Получить первый айтем
    getFirstItem(){
        return U.arr.first(this.items);
    }

    // Получить последний айтем
    getLastItem(){
        return U.arr.last(this.items);
    }

    // Получить размер айтемов
    getItemsSize(items){
        let size = 0;
        U.loop.foreach(items, (item) => {
            let c_element = new this.class_c();
            U.ev.emitSizes(c_element.v, this.orientation == ST.ORIENTATION_X ? null : this.width, this.orientation == ST.ORIENTATION_Y ? null : this.height);
            U.ev.emit(c_element.v, ST.EV_ITEM, item);
            size += c_element[this.ori_key_size];
            U.vis.kill(c_element.v);
        });
        return size;
    }

    // DRAW

    // Удалить всё
    terminate(){
        this.items = [];
        this.fringes = { up : 0, down : 0 };
        this.scroll_position = 0;
        this.item_n = { up : 0, down : -1 };
        this.container_height = 0;
        U.vis.killChildren(this.c_container.v);
        this.elements_c = {};
        U.ev.emit(this.v, ST.EV_CHANGE);
    }

    // Перерисовать все объекты, соблюдая alignment и не удаляя ничего
    draw(){
        this.container_height = 0;
        U.vis.killChildren(this.c_container.v);
        this.elements_c = {};
        if (this.alignment == ST.ALIGNMENT_TOP){
            this.item_n.down = this.item_n.up - 1;
            this.fringes.down = this.fringes.up;
            this.drawDown();
            this.drawUp();
        } else if (this.alignment == ST.ALIGNMENT_BOTTOM){
            this.item_n.up = this.item_n.down + 1;
            this.fringes.up = this.fringes.down;
            this.drawUp();
            this.drawDown();
        }
    }

    //

    // Отрисовать выше
    drawUp(){
        let c_element;
        while (this.scroll_position + this.fringes.up > 0) {
            let next_item_n = this.item_n.up - 1;
            if (this.items[next_item_n] !== undefined) {
                c_element = this._extendDrawElementProgram(next_item_n);
                this.fringes.up -= c_element[this.ori_key_size];
                c_element.v[this.ori_key_pos] = this.fringes.up;
                this.item_n.up = next_item_n;
            } else { // если мы упёрлись в последний элемент (самый верхний)
                this.stopAnimation();
                this.endlock_status != ST.ENDLOCK_STATUS_UP && U.ev.emit(this.v, ST.EV_ENDLOCK, ST.ENDLOCK_STATUS_UP);
                this.endlock_status = ST.ENDLOCK_STATUS_UP;
                // коррекция scroll, чтобы не выйти за пределы (scroll_position = -fringes.up - это автоматом перемотать на TOP позицию, чтобы первая строчка была вверху)
                if (this.container_height >= this[this.ori_key_size] || this.force_align_top_if_not_full){
                    this.scroll_position = -this.fringes.up;
                }
                break;
            }
        }
    }

    // Отрисовать ниже
    drawDown(){
        let c_element;
        while (this.scroll_position + this.fringes.down < this[this.ori_key_size]) {
            let next_item_n = this.item_n.down + 1;
            if (this.items[next_item_n] !== undefined) {
                c_element = this._extendDrawElementProgram(next_item_n);
                this.fringes.down += c_element[this.ori_key_size];
                c_element.v[this.ori_key_pos] = this.fringes.down - c_element[this.ori_key_size];
                this.item_n.down = next_item_n;
            } else { // если мы упёрлись в последний элемент (самый нижний)
                this.stopAnimation();
                this.endlock_status != ST.ENDLOCK_STATUS_DOWN && U.ev.emit(this.v, ST.EV_ENDLOCK, ST.ENDLOCK_STATUS_DOWN);
                this.endlock_status = ST.ENDLOCK_STATUS_DOWN;
                // коррекция scroll, чтобы не выйти за пределы
                if (this.container_height >= this[this.ori_key_size]){
                    this.scroll_position = -this.fringes.down + this[this.ori_key_size];
                } else if (this.force_align_top_if_not_full){
                    this.scroll_position = -this.fringes.up;
                }
                break;
            }
        }
    }

    // Наложить действия на объект при отрисовке
    _extendDrawElementProgram(next_item_n){
        let item = this.items[next_item_n], c_element;
        this.elements_c[next_item_n] = c_element = new this.class_c();
        U.ev.transfer(c_element.v, this.v, ST.EV_ELECT);
        this.c_container.add(c_element.v);
        U.ev.emitSizes(c_element.v, this.orientation == ST.ORIENTATION_X ? null : this.width, this.orientation == ST.ORIENTATION_Y ? null : this.height);
        let parameters = { c : c_element, item : item, n : next_item_n };
        U.ev.emit(this.v, ST.EV_CREATE, parameters);
        U.ev.emit(c_element.v, ST.EV_ITEM, item);
        U.ev.emit(c_element.v, ST.EV_ITEM_PARAMETERS, parameters);
        U.ev.emit(c_element.v, ST.EV_SELECTION, this.testSelection(next_item_n));
        U.ev.emitSizes(c_element.v, this.orientation == ST.ORIENTATION_X ? c_element.width : null, this.orientation == ST.ORIENTATION_Y ? c_element.height : null);
        let element_height = c_element[this.ori_key_size] || 0;
        this.container_height += element_height;
        this.endlock_status = null;
        return c_element;
    }

    // Удалить всё что выше границы
    removeUp(){
        let n = this.item_n.up, tokill = [];
        while (this.elements_c[n] && this.scroll_position + this.elements_c[n].v[this.ori_key_pos] + this.elements_c[n][this.ori_key_size] <= 0) {
            this.item_n.up++;
            let size = this.elements_c[n][this.ori_key_size];
            this.fringes.up += size;
            this.container_height -= size;
            tokill.push(this.elements_c[n].v);
            delete this.elements_c[n];
            n++;
        }
        tokill.length && U.co.async(() => {
            U.loop.foreach(tokill, (v) => {
                U.vis.kill(v);
            });
        }, 1000);
    }

    // Удалить всё что ниже границы
    removeDown(){
        let n = this.item_n.down, tokill = [];
        while (this.elements_c[n] && this.scroll_position + this.elements_c[n].v[this.ori_key_pos] >= this[this.ori_key_size]) {
            this.item_n.down--;
            let size = this.elements_c[n][this.ori_key_size];
            this.fringes.down -= size;
            this.container_height -= size;
            tokill.push(this.elements_c[n].v);
            delete this.elements_c[n];
            n--;
        }
        tokill.length && U.co.async(() => {
            U.loop.foreach(tokill, (v) => {
                U.vis.kill(v);
            });
        }, 1000);
    }

    // SCROLL

    // Выполняем прокрутку, delta - на сколько пикселей вверх или вниз будет сдвиг
    scroll(delta){
        //if (this.container_height >= this[this.ori_key_size]) {
        //if(delta){
            this.scroll_position += delta; // изменяем позицию
            if (delta > 0) { // просматриваем выше
                this.drawUp(); // рендерим вверху
                this.removeDown(); // удаляем лишнее внизу
            } else { // просматриваем ниже
                this.drawDown(); // рендерим внизу
                this.removeUp(); // удаляем лишнее вверху
            }
            U.ev.emit(this.v, ST.EV_CHANGE);
        //}
        //}
    }

    smoothScroll(direction){
        let delta = direction > 0 ? 10000 : -10000;
        let prev_scroll_position = this.scroll_position;
        this.scroll(delta);
        if(U.control.active){
            let aim_scroll_position = this.scroll_position;
            this.scroll(prev_scroll_position - aim_scroll_position);
            this.slowdown_scroll_aim = aim_scroll_position;
            this.startSlowdown();
        }
    }

    // Скроллить так, чтобы упереться вверх
    scrollTop(n = null){
        this.scroll_position = 0;
        this.container_height = 0;
        U.vis.killChildren(this.c_container.v);
        this.elements_c = {};
        n === null && (n = 0);
        n !== null && n < 0 && (n = 0);
        this.fringes = { up : 0, down : 0 };
        this.item_n = { up : n, down : n-1 }; // -1 потому что он тут же заменяется на 0
        this.drawDown();
        U.ev.emit(this.v, ST.EV_CHANGE);
    }

    // Скроллить так, чтобы упереться вниз
    scrollBottom(n = null){
        this.scroll_position = 0;
        this.container_height = 0;
        U.vis.killChildren(this.c_container.v);
        this.elements_c = {};
        this.fringes.down = this.fringes.up = this[this.ori_key_size];
        n === null && (n = this.items.length - 1);
        n !== null && n > this.items.length - 1 && (n = this.items.length - 1);
        this.item_n.up = n+1; // +1 потому что стазу же заменается на -1
        this.item_n.down = n;
        this.drawUp();
        U.ev.emit(this.v, ST.EV_CHANGE);
    }

    // Получить процент
    getScrollParameters(){
        return {
            bar_height_percent : ((this.item_n.down + 1) - (this.item_n.up - 1)) / this.items.length,
            bar_start_percent : (this.item_n.up) / (this.items.length - 1),
            full : this.container_height >= this[this.ori_key_size],
            bottom_space : this.items.length - this.item_n.down,
            top_space : this.item_n.up
        };
    }

    // ВЫДЕЛЕНИЕ

    setSelAxis(n){
        this.sel_axis = n;
        this._last_sel_axis_n = n;
    }

    selectUseSelAxis(n){
        if(this.sel_axis !== null && this._last_sel_axis_n != n){
            this._last_sel_axis_n = n;
            if(n < this.sel_axis){
                this.select(n, this.sel_axis);
            } else {
                this.select(this.sel_axis, n);
            }
        }
    }

    selectBySelecting(n){
        this.selecting = true;
        this.select(n);
        this.setSelAxis(n);
    }

    select(first, last = null){
        last === null && (last = first);
        let selected1 = U.calc.fringe(first, 0, this.items.length);
        let selected2 = U.calc.fringe(last, 0, this.items.length);
        selected1 != this.selected[0] && (this.last_changed_select_side = 0);
        selected2 != this.selected[1] && (this.last_changed_select_side = 1);
        this.selected[0] = selected1;
        this.selected[1] = selected2;
        this.emitSelections();
    }

    selectBegin(n){
        this.select(n, this.selected ? this.selected[1] : n);
    }

    selectEnd(n){
        this.select(this.selected ? this.selected[0] : n, n);
    }

    selectLast(){
        let n = this.items.length - 1;
        this.select(n);
        return n;
    }

    selectFirst(){
        this.select(0);
        return 0;
    }

    selectIncr(incr){
        this.select(this.selected ? this.selected[0] + incr : incr);
    }

    emitSelections(){
        U.ev.emit(this.v, ST.EV_SELECTION);
        U.loop.foreach(this.elements_c, (c_element, n) => {
            U.ev.emit(c_element.v, ST.EV_SELECTION, this.testSelection(n));
        });
    }

    testSelection(n){
        return this.focus && this.selected && n >= this.selected[0] && n <= this.selected[1] - 1;
    }

    // ПОЛУЧЕНИЕ НОМЕРА ЭЛЕМЕНТА ПО КООРДИНАТНОЙ ПОЗИЦИИ НА ОСИ

    getItemByMouse(){
        let itempos = this.getItemPosByMouse();
        if(itempos.n !== undefined){
            return itempos.percent >= 0.5 ? itempos.n + 1 : itempos.n;
        } else return itempos.position <= 0 ? (this.item_n.up < 0 ? 0 : this.item_n.up) : (this.item_n.down || 0) + 1;
    }

    getItemPosByMouse(){
        let mouse = this.v.toLocal(U.control.mouse);
        return this.getItemPosByPosition(mouse[this.ori_key_pos]);
    }

    getItemPosByPosition(position){
        let result = { position : position };
        U.loop.ford(this.item_n.up, this.item_n.down, (n) => {
            let c_element = this.elements_c[n];
            if(c_element){
                let element_position = c_element.v[this.ori_key_pos] + this.scroll_position;
                if(position >= element_position && element_position <= element_position + c_element[this.ori_key_size]){
                    result.n = n;
                    result.percent = (position - element_position) / c_element[this.ori_key_size];
                }
            }
        });
        return result;
    }

    // Установка скорости прокрутки

    setScrollSelSpeedByMouse(){
        let mouse = this.v.toLocal(U.control.mouse);
        let percent = mouse[this.ori_key_pos] / this[this.ori_key_size];
        let speed_up = U.calc.fringe((this.scroll_sel_percent - percent) / this.scroll_sel_percent, 0, 1);
        let speed_down = -U.calc.fringe((percent - (1 - this.scroll_sel_percent)) / this.scroll_sel_percent, 0, 1);
        this.scroll_sel_speed = (speed_up || speed_down) * this.scroll_sel_speed_max;
    }

};

ST.ENDLOCK_STATUS_UP = 1;
ST.ENDLOCK_STATUS_DOWN = 2;

ST.EV_CHANGE = 'c_roll.change';
ST.EV_ELECT = 'c_roll.elect';
ST.EV_ITEM = 'c_roll.item';
ST.EV_ITEM_PARAMETERS = 'c_roll.item_parameters';
ST.EV_ENDLOCK = 'c_roll.endlock';
ST.EV_SELECTION = 'c_roll.selection';
ST.EV_CREATE = 'c_roll.create';
ST.EV_MANUAL_SCROLL_START = 'c_roll.manual_scroll_start';
ST.EV_MANUAL_SCROLL_END = 'c_roll.manual_scroll_end';
ST.EV_FOCUS = 'c_roll.focus';

ST.ALIGNMENT_TOP = 'top';
ST.ALIGNMENT_BOTTOM = 'bottom';

ST.ORIENTATION_X = 'x';
ST.ORIENTATION_Y = 'y';

ST.MOUSE_MODE_SCROLL = 'scroll';
ST.MOUSE_MODE_SELECTION = 'selection';
