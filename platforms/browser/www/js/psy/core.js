let ST = psy_Core = class {

    constructor(){

        U = new psy_Utils();
        Q.core = this;

        Q.config = new psy_Config;
        Q.format = new psy_Format;
        Q.wscon = new psy_Wscon;
        Q.audio = new psy_Audio;
        Q.lang = new psy_Loc_Lang;
        Q.user = new psy_User;
        Q.gate = new psy_Gate;
        Q.player = new psy_Player;
        Q.chat = new psy_Chat;
        Q.pm = new psy_PM;
        Q.st = new psy_Storage;

        APP = Q.app = new PIXI.Application(Q.config.width, Q.config.height, { backgroundColor : 0xFFFFFF, antialias : true });
        Q.app.renderer.plugins.interaction.moveWhenInside = true;

        Q.vk = new psy_VK(() => {
            Q.res = new psy_Res(() => {

                document.getElementById(Q.config.canvas_id).appendChild(Q.app.view);

                Q.lang.language = 'ru';
                Q.lang.addFileData(Q.res.storage.lang_ru.data, 'ru');

                new phys_Main();
                Q.app.stage.addChild(Q.main.v);

                Q.app.view.oncontextmenu = (e) => {
                    e.preventDefault();
                };

                Q.wscon.connect(Q.config.server_host, Q.config.server_port, () => {
                    Q.wscon.sr('auth', { social_id : Q.vk.locvars.viewer_id, sn : 1, key : Q.vk.locvars.auth_key, mode : 3,  device : '3.x', social_ref : 0 });
                }, true, Q.gate);

            });
        });

    }

    launch(){

        new psy_Timer(1000 * 60, () => {
            Q.wscon.sr('alive', { time : U.time.stamp });
        }).start();
        Q.pm.genContactsLists();
        Q.main.c_frames.show('chat');

    }

};

Q = {}, APP = null;
