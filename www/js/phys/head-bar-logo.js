let ST = phys_HeadBarLogo = class extends phys_Div {

    constructor(){

        super(Q.config.padding);

        //this.c_rect = new phys_Rect(Q.config.color_ui_dark).to(this.c_content_down);

        this.pixi_image = PIXI.Sprite.from(Q.res.storage.logo.texture);
        this.pixi_image.anchor.set(0.5);
        this.c_content.add(this.pixi_image);

        new phys_Mask(this.v, phys_Mask.MODE_RECT, Q.config.arc_size);

        U.ev.listen(this.v, 'sizes', () => {
            //U.ev.emitSizes(this.c_rect.v, this);
            this.pixi_image.x = this.content_width / 2;
            this.pixi_image.y = this.content_height / 2;
        });

    }

    calcSize(height){
        this.pixi_image.height = this.getContentVerticalSize(height);
        this.pixi_image.scale.x = this.pixi_image.scale.y;
        U.ev.emitSizes(this.v, this.getHorizontalSize(this.pixi_image.width * 1.2), height);
    }

};
