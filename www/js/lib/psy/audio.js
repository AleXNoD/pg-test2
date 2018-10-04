let ST = psy_Audio = class extends psy_EventEmitter {

    constructor(){
        super();
        
    }

    load(url){
        let sound = new Howl({
            src : [url]
        });
        sound.play();
    }

};
