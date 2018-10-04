let ST = phys_ClickDetector = class extends phys_Base {

    constructor(v, callback = null, radius = 3, time_delta = 500, phys = null){

        super(v);

        this.mouse = null;
        this.time = 0;

        U.ev.listen(v, 'mousedown', (e) => {
            this.mouse = U.control.mouse.clone();
            this.time = U.time.getMs();
        }, phys);

        U.ev.listen(document, 'mouseup', (e) => {
            if(this.mouse && U.calc.distance(U.control.mouse.x - this.mouse.x, U.control.mouse.y - this.mouse.y) <= radius && U.time.getMs() - this.time < time_delta){
                U.co.exe(callback);
            }
        }, phys);

    }

};
