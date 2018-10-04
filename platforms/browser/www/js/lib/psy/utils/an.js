let ST = psy_Util_An = class {

    constructor(){
        this.groups = { scale : ['scale.x', 'scale.y'], size : ['width', 'height'] };
    }

    make(v, parameters, factor = 3, type = phys_Animation.TYPE_SLOWDOWN){
        let c_animation = null;
        U.loop.foreach(parameters, (aim, key) => {
            U.loop.foreach(this.groups[key] || [key], (key) => {
                c_animation = new phys_Animation(v, key, aim, factor, type);
            });
        });
        return c_animation;
    }

    stop(v, key = null){
        U.loop.foreach(this.groups[key] || [key], (key) => {
            U.ev.emit(v, phys_Animation.EV_STOP, key);
        });
    }

}
