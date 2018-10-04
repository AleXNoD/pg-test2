let ST = phys_Avatar = class extends phys_Image {

    constructor(fixed = false, arc_size = 0){

        super(arc_size);

        this.fixed_resize = fixed ? true : false;
        this.urp = {};

        U.ev.listen(this.v, 'sizes', () => {
            this.fixed_resize || this.adjustSize();
        });

    }

    load(url, callback = null){
        this.urp = this.parseUrl(url);
        super.load(url, callback);
        return this;
    }

    adjustSize(){
        if(this.sprite && this.width && this.height){
            let bt = this.sprite.texture.baseTexture;
            let width = bt.realWidth;
            let height = bt.realHeight;
            this.sprite.scale.set(this.height / height);
            this.sprite.width < this.width && this.sprite.scale.set(this.width / width);
            this.sprite.scale.set(this.sprite.scale.x + (this.urp.z / 20));
            this.sprite.x = (this.urp.xp / 10) * (this.width - this.sprite.width);
            this.sprite.y = (this.urp.yp / 10) * (this.height - this.sprite.height);
        }
        return this;
    }

    incrTransXp(value){
        this.incrTrans('xp', value);
    }

    incrTransYp(value){
        this.incrTrans('yp', value);
    }

    incrTransZ(value){
        this.incrTrans('z', value);
    }

    incrTrans(key, value){
        if (this.urp && this.urp[key] !== undefined && this.urp[key] !== NaN) {
            let new_value = Number(this.urp[key]) + value;
            new_value = U.calc.fringe(new_value, 0, 10);
            this.urp[key] = new_value;
            U.ev.emitSizes(this.v);
        }
    }

    parseUrl(url){
        if (url) {
            let url_array = url.split('#');
            let qs_array = url_array[1] ? url_array[1].split(';') : [];
            let parameters = { xp : 5, yp : 2, z : 0, url : url_array[0] };
            U.loop.foreach(qs_array, (qs_item) => {
                let parameter_array = qs_item.split('=');
                if (parameter_array.length == 2) {
                    parameters[parameter_array[0]] = Number(parameter_array[1]) || 0;
                } else parameters[qs_item] = true;
            });
            return parameters;
        } else return { url : '' };
    }

    stringifyUrl(){
        if(this.urp && this.urp.url){
            let parameters = [];
            U.loop.foreach(this.urp, (value, key) => {
                if(key != 'url'){
                    if(value === true){
                        parameters.push(key);
                    } else parameters.push(key + '=' + value);
                }
            });
            return urp.url + (parameters.length ? '#' + parameters.join(';') : '');
        } else return '';
    }

}
