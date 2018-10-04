let ST = phys_Lenta = class extends phys_Base {

    constructor(){

        super();

        this.c_rect = new phys_Rect(Q.config.color_ui_dark).to(this);
        this.c_roll = new phys_Roll(phys_Lenta_Element, 'x').to(this);
        new phys_Mask(this.v, phys_Mask.MODE_RECT, Q.config.arc_size);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect.v, this);
            U.ev.emitSizes(this.c_roll.v, this);
        });

    }

    add(item){
        this.c_roll.addItemToStart(item);
        this.c_roll.smoothScroll(1);
    }

    del(item_id){
        U.arr.deleteByValue(this.c_roll.items, 'id', item_id);
        this.c_roll.draw();
    }

};
