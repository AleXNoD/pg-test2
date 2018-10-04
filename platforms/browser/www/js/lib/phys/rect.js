let ST = phys_Rect = class extends phys_Base {

    constructor(color = 0, arc_size = 0, corners = null, alpha = 1){

        super();

        this.color = color;
        this.arc_size = arc_size;
        this.corners = corners;
        this.alpha = alpha;

        U.ev.listen(this.v, 'sizes', () => {
            this.render();
        });

    }

    setColor(color){
        this.color = color;
        this.render();
    }

    render(){

        this.v.removeChildren();

        this.graphics = new PIXI.Graphics();
        this.graphics.lineStyle(0);
        this.graphics.beginFill(this.color, this.alpha);
        this.arc_size && this.corners !== true ? this.graphics.drawRoundedRect(0, 0, this.width, this.height, this.arc_size) : this.graphics.drawRect(0, 0, this.width, this.height);

        this.corners && U.loop.foreach(this.corners, (corner, n) => {
            if(corner){
                n == 0 && this.graphics.drawRect(0, 0, this.arc_size, this.arc_size);
                n == 1 && this.graphics.drawRect(this.width - this.arc_size, 0, this.arc_size, this.arc_size);
                n == 2 && this.graphics.drawRect(this.width - this.arc_size, this.height - this.arc_size, this.arc_size, this.arc_size);
                n == 3 && this.graphics.drawRect(0, this.height - this.arc_size, this.arc_size, this.arc_size);
            }
        });

        this.graphics.endFill();
        this.add(this.graphics);

    }

};
