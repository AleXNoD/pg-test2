let ST = phys_Loc_AvatarRound = class extends phys_Loc_Avatar {

    constructor(){
        super(0);
        new phys_Mask(this.v, phys_Mask.MODE_ELLIPSE);
    }

};
