let ST = phys_HeadMenu = class extends phys_Div {

    constructor(){

        super(Q.config.padding);

        let menus = [
            [['MENU_GAME'], () => {}, true],
            [['MENU_CHAT'], () => { Q.main.c_frames.show('chat') }],
            [['MENU_PM'], () => { Q.main.c_frames.show('pm') }],
            [['MENU_GIFTS'], () => { Q.main.c_frames.show('gifts') }],
            [['MENU_STARS'], () => { Q.main.c_frames.show('stars') }],
            [['MENU_MISSIONS'], () => { Q.main.c_frames.show('missions') }],
            [['MENU_TOP'], () => { Q.main.c_frames.show('top') }],
            [['MENU_TRANSFERS'], () => { Q.main.c_frames.show('transfers') }],
        ];

        this.c_rect = new phys_Rect(Q.config.color_ui_dark).to(this.c_content_down);
        new phys_Mask(this.c_content.v, phys_Mask.MODE_RECT, Q.config.arc_size);

        U.loop.foreach(menus, (menu) => {
            menu.c = new phys_HeadMenu_Element(menu[0], menu[1], menu[2]).to(this.c_content);
        });

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_rect.v, this);
            U.spread.inResize(1, U.arr.valuesByKey(menus, 'c'), this.content_width, this.content_height, 'x', [0.22]);
        });

    }

};
