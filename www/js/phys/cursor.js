let ST = phys_Cursor = class extends phys_Base {

    constructor(){

        super();

        this.keys = new Set;

        this.visible = false;

        this.v_round = PIXI.Sprite.from(Q.res.storage.cursor_round.texture);
        this.v_round.anchor.set(0.5);
        this.add(this.v_round);

        this.v_heart = PIXI.Sprite.from(Q.res.storage.cursor_heart.texture);
        this.v_heart.anchor.set(0.5);
        this.add(this.v_heart);

        document.body.addEventListener("mouseout", () => {
            this.v.alpha = 0;
        });

        document.body.addEventListener("mouseover", () => {
            this.v.alpha = 1;
        });

        this.display();

    }

    initTicker(){
        this.ticker(delta => {
            this.v_round.rotation -= 0.18;
            let pos = Q.app.renderer.plugins.interaction.mouse.global;
            this.v.x = pos.x;
            this.v.y = pos.y;
        });
    }

    destroyTicker(){
        this.removeTicks();
    }

    display(){
        if(this.keys.size > 0){
            this.v.visible || this.initTicker();
            this.v.visible = true;
            Q.main.v.interactiveChildren = false;
            document.body.style.cursor = 'none';
            Q.app.view.style.cursor = 'inherit';
            Q.app.renderer.plugins.interaction.update();
        } else {
            this.v.visible && this.destroyTicker();
            this.v.visible = false;
            Q.main.v.interactiveChildren = true;
            document.body.style.cursor = 'inherit';
            Q.app.renderer.plugins.interaction.update();
        }
    }

    show(key){
        this.keys.add(key);
        this.display();
    }

    hide(key){
        this.keys.delete(key);
        this.display();
    }

};
