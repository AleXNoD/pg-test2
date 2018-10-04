let ST = phys_Frame_PM_Panel = class extends phys_Div {

    constructor(){

        super();
        this.setMargin(1, false, false, false, true); // вертикальная линия слева, 1px подложки

        this.title_height = 38;

        this.c_title = new phys_TitleRect(0xFFFFFF).to(this.c_content); // тайтл
        this.c_title.c_th.put(['PM_TITLE_CONTACTS']);
        this.c_contacts_div = new phys_Div(Q.config.padding).to(this.c_content); // контейнер для контактов
        this.c_contacts_bg = new phys_Rect(0xFFFFFF).to(this.c_contacts_div.c_content_down);
        this.c_contacts = new phys_Roll(phys_Frame_PM_Contact, 'y').to(this.c_contacts_div.c_content); // roll контактов

        U.ev.listenSizes(this.v, () => {
            U.ev.emitSizes(this.c_title.v, this.content_width, this.title_height);
            U.ev.emitSizes(this.c_contacts_div.v, this.content_width, this.content_height - this.title_height - 1);
            this.c_contacts_div.v.y = this.content_height - this.c_contacts_div.height;
            U.ev.emitSizes(this.c_contacts_bg.v, this.c_contacts_div);
            U.ev.emitSizes(this.c_contacts.v, this.c_contacts_div.csizes);
        });

        U.ev.listen(Q.pm, psy_PM.EV_RENDER_CONTACTS, (contacts) => {
            this.c_contacts.replaceItems(contacts);
        });

    }

};
