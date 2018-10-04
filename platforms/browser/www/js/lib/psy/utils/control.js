let ST = psy_Util_Control = class {

    constructor(){

        this.ee = new psy_EventEmitter();
        this.re_input_simple = /^[А-я -~ёЁ]$/;
        this.click_radius = 3;
        this.click_time_delta = 500;
        this.click_time = 0;
        this.mouse = new PIXI.Point();
        this.mouse_click = null;
        this.keyon = {};
        this.active = true;
        this.over_set = new Set();
        this.enable_mouseout_alternative = true;

        U.ev.listen(document, 'keydown', (e) => { // keyboardEvent
            let simple = this.re_input_simple.test(e.key);
            simple && !e.ctrlKey && !e.altKey && U.ev.emit(this.ee, ST.EV_INPUT, e.key);
            //e.keyCode == 67 && e.ctrlKey && U.ev.emit(this.ee, ST.EV_COMBO_COPY);
            //e.keyCode == 88 && e.ctrlKey && U.ev.emit(this.ee, ST.EV_COMBO_CUT);
            U.ev.emit(this.ee, ST.EV_KEY, { code : e.keyCode, key : e.key, ctrl : e.ctrlKey, alt : e.altKey, shift : e.shiftKey });
            this.keyon[e.keyCode] = 1;
            e.preventDefault();
        });

        U.ev.listen(document, 'keyup', (e) => { // keyboardEvent
            this.keyon[e.keyCode] && (delete this.keyon[e.keyCode]);
            e.preventDefault();
        });

        U.ev.listen(document, 'paste', (e) => { // clipboardEvent
            let data = e.clipboardData.getData('text/plain');
            U.ev.emit(this.ee, ST.EV_INPUT, data);
        });

        U.ev.listen(document, 'copy', (e) => { // clipboardEvent
            U.ev.emit(this.ee, ST.EV_COPY, (data) => {
                e.clipboardData.setData('text/plain', data);
                e.preventDefault();
            });
        });

        U.ev.listen(document, 'cut', (e) => { // clipboardEvent
            U.ev.emit(this.ee, ST.EV_CUT, (data) => {
                e.clipboardData.setData('text/plain', data);
                e.preventDefault();
            });
        });

        U.ev.listen(document, 'mousemove', (e) => { // mousemove
            this.mouse.x = e.pageX;
            this.mouse.y = e.pageY;
            U.ev.emit(this.ee, ST.EV_MOUSE_MOVE);
            if(this.enable_mouseout_alternative){
                U.co.async(() => {
                    this._testOverSet();
                });
            }
        });

        U.ev.listen(document, 'wheel', (e) => { // mousemove
            e.preventDefault();
            e.returnValue = false;
            U.ev.emit(this.ee, ST.EV_WHEEL, (e.deltaY / Math.abs(e.deltaY)) * -3);
        });

        U.ev.listen(window, 'blur', (e) => {
            this.active = false;
        });

        U.ev.listen(window, 'focus', (e) => {
            this.active = true;
        });

    }

    addOver(c_button){
        if(this.enable_mouseout_alternative){
            c_button.over_point = this.mouse.clone();
            c_button.over_factor = 2;
            this.over_set.has(c_button) || U.ev.emit(c_button.v, 'mouseover_alternative');;
            this.over_set.add(c_button);
        }
    }

    _testOverSet(){
        U.loop.foreach(Array.from(this.over_set), (c_button) => {
            if(c_button.over_point && (c_button.over_point.x != this.mouse.x || c_button.over_point.y != this.mouse.y)){
                c_button.over_factor--;
                if(c_button.over_factor == 0){
                    U.ev.emit(c_button.v, 'mouseout_alternative');
                    this.over_set.delete(c_button);
                }
            }
        });
    }

};

ST.EV_INPUT = 'm_control.input';
ST.EV_COPY = 'm_control.combo_copy';
ST.EV_CUT = 'm_control.combo_cut';
ST.EV_KEY = 'm_control.key';
ST.EV_MOUSE_MOVE = 'm_control.mousemove';
ST.EV_WHEEL = 'm_control.wheel';
