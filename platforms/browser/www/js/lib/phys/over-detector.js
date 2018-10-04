let ST = phys_OverDetector = class extends phys_Base {

    constructor(v){

        super(v);

        this.over = false;

        U.ev.listen(v, 'mousemove', (e) => {
            U.control.addOver(this);
        });

        U.ev.listen(v, 'mouseover_alternative', (e) => {
            this.over = true;
        });

        U.ev.listen(v, 'mouseout_alternative', (e) => {
            this.over = false;
        });

    }

};
