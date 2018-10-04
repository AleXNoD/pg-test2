let ST = phys_Image = class extends phys_Base {

    constructor(arc_size = 0){

        super();

        this.c_container = new phys_Base().to(this);
        this.c_rect_hit = new phys_Rect(0, 0, null, 0).to(this);
        this.url = null;
        this.sprite = null;
        this.fixed_resize = true;

        new phys_Mask(this.v, phys_Mask.MODE_RECT, arc_size);

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emit(this.c_container.v, this);
            U.ev.emit(this.c_rect_hit.v, this);
            this.fixed_resize && this.adjustSize();
        });

        U.ev.listen(this.v, 'kill', () => {
            this.clear();
        });

    }

    load(url, callback = null){
        this.clear();
        this.url = url;
        if(url){
            U.texture.load(url, () => {
                if(this.url == url && this.v){
                    let bt = U.texture.use(url);
                    this.sprite = new PIXI.Sprite.from(bt);
                    this.c_container.add(this.sprite);
                    U.ev.emitSizes(this.v);
                    U.co.exe(callback);
                }
            });
        } else {
            U.co.exe(callback);
        }
        return this;
    }

    adjustSize(){
        if(this.sprite && this.width && this.height){
            let bt = this.sprite.texture.baseTexture;
            let width = bt.realWidth;
            let height = bt.realHeight;
            let percent_x = this.width / width;
            if(percent_x < 1){
                width *= percent_x;
                height *= percent_x;
            }
            let percent_y = this.height / height;
            if(percent_y < 1){
                width *= percent_y;
                height *= percent_y;
            }
            this.sprite.width = width;
            this.sprite.height = height;
            this.sprite.x = (this.width - width) / 2;
            this.sprite.y = (this.height - height) / 2;
        }
        return this;
    }

    clear(){
        if(this.url && this.sprite){
            U.texture.clear(this.url);
            U.vis.killChildren(this.c_container.v);
        }
    }

}
