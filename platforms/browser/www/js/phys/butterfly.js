let ST = phys_Butterfly = class extends phys_Base {

    constructor(){

        super();

        let image = PIXI.Sprite.from(Q.res.storage.butterfly.texture);
        image.anchor.set(0.5);
        this.add(image);
        this.v.x = Q.config.width * Math.random();
        this.v.y = Q.config.height * Math.random();

        let cnt = Math.random() * 100;
        let rotspeed = U.arr.random([0.03, -0.02, 0.02, -0.03, 0.01, -0.01]);
        Q.app.ticker.add(delta => {
            this.v.rotation += rotspeed * delta;
            this.v.x += U.calc.xsin(2, this.v.rotation);
            this.v.y += U.calc.ycos(2, this.v.rotation);
            image.scale.x = 0.75 + Math.sin(cnt) * 0.25;
            image.scale.y = 0.95 + Math.sin(cnt + Math.PI) * 0.1;
            cnt += 0.4;
        });

        this.v.rotation = U.calc.radians(U.calc.random(360));
        this.v.scale.set(U.calc.random(5, 10) / 10);

        let filter = new PIXI.filters.ColorMatrixFilter();
        filter.hue(Math.random() * 360, true);
        this.v.filters = [filter];

    }

}
