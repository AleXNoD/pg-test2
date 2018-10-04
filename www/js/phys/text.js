let ST = phys_Loc_Text = class extends phys_Text {

    constructor(size, color){

        super({
            fontFamily: 'Calibri',
            align : 'center',
            fill : color,
            fontSize: size,
            wordWrap : true
        });

    }

    put(text){
        return super.put(U.text.desafeUTF(Q.lang.parse(text)));
    }

};
