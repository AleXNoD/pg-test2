let ST = phys_FPS = class extends phys_Base {

    constructor(pixi_app){

        super();

        this.fps_counter = 0;
        this.last_ms = U.time.get_ms();

        this.c_rect = new phys_Rect(0).eqv({alpha : 0.75}).to(this);
        this.c_tf = new phys_Text({
            fontFamily: 'Consolas',
            align : 'center',
            fill : 0xFFFF00,
            fontSize: 24
        }).to(this);
        this.c_tf_render = new phys_Text({
            fontFamily: 'Consolas',
            align : 'center',
            fontSize: 11
        }).eq({ valign : 'bottom' }).to(this);

        new phys_Mask(this.v, phys_Mask.MODE_RECT, Q.config.arc_size, [0, 1, 1, 1]);

        pixi_app.ticker.add((delta) => {
            this.fps_counter++;
            let ms = U.time.get_ms();
            if(ms - this.last_ms >= 1000){
                this.c_tf.put(this.fps_counter);
                this.last_ms = ms;
                this.fps_counter = 0;
                if(pixi_app.renderer instanceof PIXI.WebGLRenderer){
                    this.c_tf_render.tf.style.fill = 0xFF00FF;
                    this.c_tf_render.put('WebGL');
                } else if(pixi_app.renderer instanceof PIXI.CanvasRenderer){
                    this.c_tf_render.tf.style.fill = 0x66CC00;
                    this.c_tf_render.put('Canvas');
                } else {
                    this.c_tf_render.tf.style.fill = 0xFFFFFF;
                    this.c_tf_render.put('no render');
                }
            }
        });

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect.v, this);
            U.ev.emitSizes(this.c_tf.v, this);
            U.ev.emitSizes(this.c_tf_render.v, this);
        });

    }

};
