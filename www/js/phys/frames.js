let ST = phys_Frames = class extends phys_Div {

    constructor(){

        super(0);

        this.c_rect = new phys_Rect(Q.config.color_ui_grey).to(this.c_content_down);
        this.frames_c = {};
        this.current_frame_name = null;

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect.v, this);
            U.loop.foreach(this.frames_c, (c_frame) => {
                U.ev.emitSizes(c_frame.v, this.content_width, this.content_height);
            });
        });

        // Добавляем шипы

        this.c_chat = this.frames_c['chat'] = Q.frame_chat = new phys_Frame_Chat().to(this.c_content);
        this.c_pm = this.frames_c['pm'] = Q.frame_pm = new phys_Frame_PM().to(this.c_content);
        this.c_gifts = this.frames_c['gifts'] = new phys_Frame_Gifts().to(this.c_content);
        this.c_missions = this.frames_c['missions'] = new phys_Frame_Missions().to(this.c_content);
        this.c_top = this.frames_c['top'] = new phys_Frame_Top().to(this.c_content);
        this.c_pick = this.frames_c['pick'] = new phys_Frame_Pick().to(this.c_content);
        this.c_kiss = this.frames_c['kiss'] = new phys_Frame_Kiss().to(this.c_content);
        this.c_stars = this.frames_c['stars'] = new phys_Frame_Stars().to(this.c_content);
        this.c_transfers = this.frames_c['transfers'] = new phys_Frame_Transfers().to(this.c_content);

        U.loop.foreach(this.frames_c, (c_frame) => {
            c_frame.v.visible = false;
        });

    }

    show(frame_name){
        if(this.frames_c[frame_name]){
            this.current_frame_name && (this.frames_c[this.current_frame_name].v.visible = false);
            this.current_frame_name = frame_name;
            let c_frame = this.frames_c[this.current_frame_name];
            c_frame.v.visible = true;
            U.ev.emit(c_frame.v, ST.EV_SHOW);
        }
    }

};

ST.EV_SHOW = 'c_frames.show';
