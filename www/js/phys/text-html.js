let ST = phys_Loc_TextHTML = class extends phys_TextHTML {

    constructor(size, color, align = phys_TextHTML.ALIGN_LEFT, valign = phys_TextHTML.ALIGN_TOP){

        super({
            fontFamily: 'Calibri',
            align : 'left',
            fill : color,
            fontSize: size,
            lineHeight : 0
        });

        this.align = align;
        this.valign = valign;

    }

    put(text){
        return super.put(U.text.desafeUTF(Q.lang.parse(text)));
    }

};
