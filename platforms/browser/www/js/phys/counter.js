let ST = phys_Counter = class extends phys_Base {

    constructor(){

        super();

        this.c_container = new phys_Base().to(this);
        this.c_bg = new phys_Ellipse(0xFFFF00).to(this.c_container);
        this.c_tf = new phys_Loc_Text(11, 0x000000).to(this.c_container);

        this.text_size = 11;
        this.num = 0;

        U.ev.listenSizes(this.v, () => {
            this.c_container.v.x = this.width / 2;
            this.c_container.v.y = this.height / 2;
            U.ev.emitSizes(this.c_bg.v, this);
            this.c_bg.v.x = -this.width / 2;
            this.c_bg.v.y = -this.height / 2;
            U.ev.emitSizes(this.c_tf.v, this);
            this.c_tf.v.x = -this.width / 2;
            this.c_tf.v.y = -this.height / 2;
        });

        this.draw(0);

    }

    incr(value){
        this.num += value;
        this.draw();
    }

    put(value){
        this.num = value;
        this.draw();
    }

    draw(an_factor = 4){
        if(!this.num){
            U.an.make(this.c_container.v, { scale : 0, alpha : 0 }, an_factor);
        } else {
            U.an.make(this.c_container.v, { scale : 1, alpha : 1 }, an_factor);
            let num_string = String(this.num);
            let size = this.text_size;
            num_string.length >= 2 && (size -= 2);
            num_string.length >= 3 && (size -= 2);
            this.c_tf.editStyle({ fontSize : size, wordWrap : false, fontWeight : 'bold' });
            this.c_tf.put(num_string);
        }
    }

}
