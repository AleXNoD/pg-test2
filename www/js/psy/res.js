let ST = psy_Res = class {

    constructor(callback = null){

        const loader = new PIXI.loaders.Loader();
        this.storage = null;

        loader.add('butterfly', './res/image/babochka.png');
        loader.add('logo', './res/image/logo.png');
        loader.add('cursor_round', './res/image/cursor-round.png');
        loader.add('cursor_heart', './res/image/cursor-heart.png');
        loader.add('gifts', './res/image/gifts.png');
        loader.add('lang_ru', './res/lang/ru.lang');

        loader.load((loader, storage) => {
            this.storage = storage;
            U.co.exe(callback);
        });

    }

};
