let ST = phys_Main = class extends phys_Base {

    constructor(){

        super();

        Q.main = this;

        this.c_layer1 = new phys_Base().to(this);
        this.c_layer2 = new phys_Base().to(this);
        this.c_layer3 = new phys_Base().to(this);

        this.c_stekbox = new phys_Stekbox(0.1, Q.config.stek_factor_show, Q.config.stek_factor_hide).to(this.c_layer2);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_stekbox.v, this);
        });

        this.emitScreenSize();

    }

    draw(){

        this.c_head_bar = new phys_HeadBar().to(this.c_layer1);
        this.c_head_menu = new phys_HeadMenu().to(this.c_layer1);
        this.c_frames = new phys_Frames().to(this.c_layer1);
        this.c_foot = new phys_Foot().to(this.c_layer1);
        this.c_butterflies = new phys_Base().to(this.c_layer1);
        this.c_cursor = new phys_Cursor().to(this.c_layer3);

        /*this.c_fps = new phys_FPS(Q.app).resize(50, 40).to(this);
        this.c_fps.v.x = Q.config.width - this.c_fps.width;
        this.c_fps.v.y = Q.config.height - this.c_fps.height;*/

        U.loop.forn(6, () => {
            //this.c_butterflies.add(new phys_Butterfly().v);
        });

        // --

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_head_bar.v, this.width, 40);
            U.ev.emitSizes(this.c_head_menu.v, this.width, 33);
            this.c_head_menu.v.y = this.c_head_bar.height;
            U.ev.emitSizes(this.c_foot.v, this.width, 63);
            this.c_foot.v.y = this.height - this.c_foot.height;
            U.ev.emitSizes(this.c_frames.v, this.width, this.height - this.c_head_bar.height - this.c_head_menu.height - this.c_foot.height);
            this.c_frames.v.y = this.c_head_menu.v.y + this.c_head_menu.height;
        });

        this.emitScreenSize();

        Q.app.view.onwebkitfullscreenchange = () => {
            this.emitScreenSize();
        };

    }

    setFullscreen(yes){
        yes ? Q.app.view.webkitRequestFullscreen() : Q.app.view.webkitCancelFullscreen();
    }

    emitScreenSize(){
        if(document.webkitIsFullScreen){
            U.ev.emitSizes(this.v, window.screen.width, window.screen.height);
        } else U.ev.emitSizes(this.v, Q.config.width, Q.config.height);
        Q.app.renderer.resize(this.width, this.height);
    }

};
