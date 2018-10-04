let ST = psy_Positron = class {

    constructor(margin = 0){
        this.margin = margin;
        this.point = { x : 0, y : 0 };
        this.margin_ready = { x : true, y : true };
    }

    put(c, point, c_near = null){
        let point_anti = U.spread.point_assoc_anti[point];
        this.margin_ready[point] || this.moveMargin(1, point);
        c.v[point_anti] = c_near ? c_near.v[point_anti] : 0;
        c.v[point] = this.point[point];
        this.move(c[U.spread.point_assoc_size[point]], point);
        this.margin_ready[point] = false;
    }

    putY(c, c_near = null){
        this.put(c, 'y', c_near);
    }

    putX(c, c_near = null){
        this.put(c, 'x', c_near);
    }

    move(pixels, point){
        this.point[point] += pixels;
        this.margin_ready[point] = true;
    }

    moveX(pixels){
        this.move(pixels, 'x');
    }

    moveY(pixels){
        this.move(pixels, 'y');
    }

    moveMargin(factor, point){
        this.move(this.margin * factor, point);
    }

    moveMarginX(factor){
        this.moveMargin(factor, 'x');
    }

    moveMarginY(factor){
        this.moveMargin(factor, 'y');
    }

    clear(){
        this.point = { x : 0, y : 0 };
        this.margin_ready = { x : true, y : true };
    }

}
