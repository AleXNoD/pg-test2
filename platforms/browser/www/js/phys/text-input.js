let ST = phys_Loc_TextInput = class extends phys_TextInput {

    constructor(size, color){

        super();

        this.editStyle({
            fontFamily: 'Calibri',
            align : 'left',
            fill : color,
            fontSize: size,
            wordWrap : false
        });

    }

    put(text){
        return super.put(U.text.desafeUTF(Q.lang.parse(text)));
    }

};
