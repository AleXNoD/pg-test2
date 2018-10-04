let ST = phys_Text = class extends phys_Base {

    constructor(style = null){

        super();

        this.halign = 'center';
        this.valign = 'middle';

        this.tf = new PIXI.Text('');
        this.add(this.tf);

        style && this.editStyle(style);

        U.ev.listen(this.v, 'sizes', (e) => {
            this.tf.style.wordWrapWidth = this.width;
            let metrics = PIXI.TextMetrics.measureText(this.tf.text, this.tf.style, this.tf.style.wordWrap);
            if(this.halign == 'center'){
                this.tf.x = Math.round((this.width - metrics.width) / 2);
            } else if(this.halign == 'left'){
                this.tf.x = 0;
            } else if(this.halign == 'right'){
                this.tf.x = Math.round(this.width - metrics.width);
            }
            if(this.valign == 'middle'){
                this.tf.y = Math.round((this.height - metrics.height) / 2);
            } else if(this.valign == 'bottom'){
                this.tf.y = Math.round(this.height - metrics.height);
            } else if(this.valign == 'top'){
                this.tf.y = 0;
            }
        });

    }

    put(text){
        this.text = text;
        this.tf.text = text;
        U.ev.emitSizes(this.v);
        return this;
    }

    alignment(h, v){
        this.halign = h;
        this.valign = v;
        this.put(this.text);
        return this;
    }

    editStyle(style){
        U.co.eq(this.tf.style, style);
        this.tf.text = this.tf.text;
        return this;
    }

    attachShadow(color = 0, blur = 3, distance = 0, alpha = 1){
        U.co.eq(this.tf.style, {
            dropShadow: true,
            dropShadowColor: color,
            dropShadowBlur: blur,
            dropShadowDistance: distance,
            dropShadowAlpha : alpha
        });
    }

};
