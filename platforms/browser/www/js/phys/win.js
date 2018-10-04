let ST = phys_Win = class extends phys_Base {

    constructor(name){

        super();

        this.title_height = 35;

        this.c_c1 = new phys_Base().to(this);
        this.c_rect_shadow = new phys_Rect(0x000000, Q.config.arc_size + 3, null, 0.02).to(this.c_c1);
        this.c_c2 = new phys_Base().to(this.c_c1);
        this.c_rect = new phys_Rect(0xFFFFFF).to(this.c_c2);
        this.c_head = new phys_WinHead().to(this.c_c2);
        this.c_div = new phys_Div(Q.config.padding_x4).to(this.c_c2);
        new phys_Mask(this.c_c2.v, phys_Mask.MODE_RECT, Q.config.arc_size);
        this.c_rect_shadow.v.filters = [new PIXI.filters.BlurFilter(20, 7, 1, 5)];

        this.removing = false;

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect_shadow.v, this.width + Q.config.padding * 2, this.height + Q.config.padding * 2);
            this.c_rect_shadow.v.x = this.c_rect_shadow.v.y = -Q.config.padding;
            U.ev.emitSizes(this.c_c2.v, this);
            U.ev.emitSizes(this.c_rect.v, this);
            U.ev.emitSizes(this.c_head.v, this.width, this.title_height);
            U.ev.emitSizes(this.c_div.v, this.width, this.height - this.c_head.height);
            this.c_div.v.y = this.c_head.height;
        });

        U.ev.listen(this.v, phys_Stekbox.EV_CLOSE, () => {
            if(!this.removing){
                this.removing = true;
                U.an.make(this.c_c1.v, { scale : 0, alpha : 0 }, Q.config.stek_factor_hide).callback = () => { // Q.config.stek_factor_hide
                    U.vis.kill(this.v);
                };
                this.ticker(delta => {
                    this.c_c1.v.x = ((this.width +  Q.config.padding * 2) - this.c_c1.v.width) / 2;
                    this.c_c1.v.y = ((this.height +  Q.config.padding * 2) - this.c_c1.v.height) / 2;
                });
            }
        });

        U.an.make(this.c_c1.v, { rotation : [0.1, 0], alpha : [0, 1], y : [20, 0] }, Q.config.stek_factor_show);
        Q.main.c_stekbox.add(this, name);

    }

    setHeadColor(color){
        this.c_head.c_rect.graphics && (this.c_head.c_rect.graphics.tint = color);
    }

};
