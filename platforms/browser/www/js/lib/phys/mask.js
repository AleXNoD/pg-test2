let ST = phys_Mask = class extends phys_Base {

    constructor(v, mode, arc_size = 0, corners = null){

        super(v);
        this.eq({ mode, arc_size, corners });

        U.ev.listen(this.v, 'sizes', () => {
            this.draw();
        });

    }

    draw(){

        this.v.mask && this.v.mask.destroy();

        if(this.mode == ST.MODE_RECT){
            this.v.mask = new phys_Rect(0, this.arc_size, this.corners).resize(this.width, this.height).to(this.v).graphics;
        } else if(this.mode == ST.MODE_ELLIPSE){
            this.v.mask = new phys_Ellipse(0).resize(this.width, this.height).to(this.v).graphics;
        }

    }

};

ST.MODE_ELLIPSE = 1;
ST.MODE_RECT = 2;
