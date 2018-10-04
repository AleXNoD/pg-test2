let ST = phys_DivRect = class extends phys_Div {

    constructor(color){

        super();

        this.c_bg = new phys_Rect(color).to(this.c_content_down);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_bg.v, this);
        });

    }

};
