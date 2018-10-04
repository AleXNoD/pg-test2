let ST = phys_Ellipse = class extends phys_Base {

    constructor(color = 0, alpha = 1){

        super();

        this.color = color;
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
        this.graphics.drawEllipse(this.width/2, this.height/2, this.width/2, this.height/2);
        this.graphics.endFill();

        this.add(this.graphics);

    }

};
