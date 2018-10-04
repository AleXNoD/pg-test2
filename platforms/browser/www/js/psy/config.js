let ST = psy_Config = class {

    constructor(){

        this.width = 850;
        this.height = 700;

        this.arc_size = 8;
        this.padding = 5;
        this.padding_x2 = 10;
        this.padding_x4 = 20;

        this.button_def_height = 30;
        this.input_def_height = 30;

        this.vk_group_id = 9421441;
        this.font = 'Calibri';

        this.canvas_id = 'exosf';

        this.color_ui_main = 0x587A98;
        this.color_ui_dark = 0x29445f;
        this.color_ui_light = 0x7E9DB8;
        this.color_ui_grey = 0xEEEEEE;
        this.color_ui_title = 0xFFFFCC;
        this.color_button = 0x96B2D0;
        this.color_text = 0x000000;
        this.color_text_grey = 0x444444;
        this.color_win_head = this.color_ui_main;

        this.stek_factor_show = 5;
        this.stek_factor_hide = 3;

        this.emo_limit = { chat : 3, lenta : 3, pm : 30 };

        this.pm_typing_in_time = 8;
        this.pm_typing_out_time = 5;

        this.server_host = 'gate.alexnod.com';
        this.server_port = 7019;

        this.pm_last_history_count = 11;

    }

};
