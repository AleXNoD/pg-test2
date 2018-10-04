let ST = phys_HeadMenu_Element = class extends phys_Base {

    constructor(text, callback, lighter = false){

        super();

        let color = 0xDFF4F1;
        lighter && (color = U.color.multiply(color, 1.1));

        this.c_button = new phys_Loc_Button(true, color, 14).to(this);
        this.c_button.put(text);
        this.c_button.callback = callback;

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_button.v, this);
        });

    }

}
