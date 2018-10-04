let ST = phys_TextInput_Caret = class extends phys_Base {

    constructor(){

        super();

        this.animation_val = 0;

        this.c_rect = new phys_Rect(0x000000).to(this);

        this.m_timer = new psy_Timer(700, () => {
            U.an.make(this.v, { alpha : (++this.animation_val % 2 === 0 ? 1 : 0) }, 8);
        });

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect.v, this.width, this.height);
        });

        U.ev.listen(this.v, 'kill', () => {
            this.hide();
        });

        this.hide();

    }

    show(){
        this.v.visible = true;
        this.animation_val = 0;
        U.an.make(this.v, { alpha : 1 }, 0);
        this.m_timer.start();
    }

    hide(){
        this.v.visible = false;
        this.m_timer.stop();
    }

    visual(yes){
        yes ? this.show() : this.hide();
    }

};
