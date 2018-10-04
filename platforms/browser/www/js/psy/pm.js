let ST = psy_PM = class extends psy_EventEmitter {

    constructor(){

        super();

        this.contacts = {};
        this.current_contact = 0;
        this.loading_posts = {};
        this.contacts_lists = {};
        this.m_unread = new psy_Keylen;

        this.asyone_contacts = U.asyone.addCallback(() => {
            U.ev.emit(this, ST.EV_RENDER_CONTACTS, this.contacts_lists.actual.concat(this.contacts_lists.online, this.contacts_lists.offline, this.contacts_lists.alien));
        });

        this.asyone_contacts_lite = U.asyone.addCallback(() => {
            U.ev.emit(this, ST.EV_RENDER_CONTACTS_LITE);
        });

        U.ev.listen(this.m_unread, psy_Keylen.EV_UPDATE, (count) => {
            // тут обновляем счётчик приватов непрочитанных
        });

        U.ev.listen(Q.player, psy_Player.EV_UPD_ONLINES, (players_id) => {
            U.loop.foreach(players_id, (player_id) => {
                this.testContactAdded(player_id) && this.refreshContactList(player_id);
            });
        });

    }

    init(){
        this.genContactsLists();
    }

    // Dialogs

    // Очистить переписку
    clearHistory(player_id, callback = null){
        Q.wscon.sr('clear_pm_history', { player_id }).cb(() => {
            this.contacts[player_id].posts = [];
            U.co.exe(callback);
        });
    }

    // Отправить сообщение текущему контакту
    sendMessage(message, callback = null){
        if(this.current_contact){
            Q.wscon.sr('send_pm_message', { to_player_id : this.current_contact.id, message }).cb(callback);
            this.addDialogPost(this.current_contact.id, Q.st.player_id, message, U.time.stamp);
            this.current_contact.typing_out = 0;
            U.ev.emit(this, ST.EV_SEND_MESSAGE, message);
        }
    }

    // Подгрузить историю сообщений
    loadDialogPosts(contact_id, count, callback = null, delay = false){
        if(!this.loading_posts[contact_id]){
            this.loading_posts[contact_id] = true;
            U.co.async(() => {
                Q.wscon.sr('get_pm_dialog_posts', { player_id : contact_id, count : count, clear_counter : 1 }).cb((r) => {
                    delete this.loading_posts[contact_id];
                    U.co.exe(callback, r);
                });
            }, delay ? 1500 : 0);
        }
    }

    // Если диалог есть, то открыть, либо сразу подгрузить историю сообщений - эта функция по кнопке НАПИСАТЬ или по клику на контакт
    openDialog(contact_id, callback = null){
        let after_func = () => {
            this.openLoadedDialog(contact_id);
            U.co.exe(callback);
        };
        if(this.testDialogLastHistoryExists(contact_id)){
            after_func();
        } else this.loadDialogPosts(contact_id, Q.config.pm_last_history_count, after_func);
    }

    // Добавить посты, которые пришли к нам в текстовом виде, который следует распарсить сперва
    addDialogPostsSource(contact_id, posts_text){
        this.addContactIfNotExists(contact_id); // тут также обновлятор для списка, если надо
        let posts = this.parsePostsSource(posts_text);
        let contact = this.contacts[contact_id];
        let player_info = Q.user.getPlayerInfo(contact_id);
        contact.posts = posts;
        contact.last_history_exists = true;
        player_info.autotext && this.addDialogServicePost(contact_id, player_info.autotext);
    }

    // Добавить сервисное сообщение
    addDialogServicePost(contact_id, message, update_time = false){
        let time = U.time.stamp;
        let post = this.genPost(0, message, time, true);
        let after_func = () => {
            let contact = this.contacts[contact_id];
            contact.posts.push(post);
            update_time && (contact.last_message_time = time);
            this.refreshContactList(contact_id);
        };
        if(this.testDialogLastHistoryExists(contact_id)){
            after_func();
        } else this.loadDialogPosts(contact_id, Q.config.pm_last_history_count, () => {
            after_func();
        }, true);
    }

    // Добавить поступившее онлайн сообщение
    addDialogPost(contact_id, player_id, message, time){
        let after_func = () => {
            let contact = this.contacts[contact_id];
            player_id != Q.st.player_id && (contact.typing_in = 0);
            if(!this.testCurrentContact(contact_id) || !Q.frame_pm.v.visible){
                contact.unread++;
                this.m_unread.add(contact_id, 1);
            }
            this.refreshContactList(contact_id);
        };
        if(this.testDialogLastHistoryExists(contact_id)){
            let post = this.genPost(player_id, message, time);
            let contact = this.contacts[contact_id];
            contact.posts.push(post);
            contact.last_message_time = time;
            this.testCurrentContact(contact_id) && U.ev.emit(this, ST.EV_ADD_POST_CURRENT, post);
            after_func();
        } else this.loadDialogPosts(contact_id, Q.config.pm_last_history_count, () => {
            let contact = this.contacts[contact_id];
            contact.last_message_time = contact.posts.length ? U.arr.last(contact.posts).time : 0;
            after_func();
        }, true);
    }

    // Обнулить счётчик непрочитанных текущего диалога
    clearCurrentUnread(){
        if(this.current_contact){
            this.current_contact.unread = 0;
            this.m_unread.add(this.current_contact.id, 0);
        }
    }

    // Contacts

    getCurrentContactId(){
        return this.current_contact ? current_contact.id : 0;
    }

    addContactUnread(contact_id, unread, time){
        this.addContactIfNotExists(contact_id);
        let contact = this.contacts[contact_id];
        contact.unread += unread;
        contact.last_message_time = time;
        this.m_unread.add(contact_id, 1);
        this.refreshContactList(contact_id);
    }

    refreshContactList(contact_id){ // переопределить в каком списке находится contact
        let contact = this.contacts[contact_id];
        if(contact && this.contacts_lists){
            let list = this.getContactListKey(contact);
            if(contact.list != list || (list == 'actual' && contact_id != this.contacts_lists[list][0].id && this.contacts_lists[list][0].last_message_time <= contact.last_message_time)){
                contact.list && U.arr.deleteByValue(this.contacts_lists[contact.list], 'id', contact_id); // удаляем из предыдущего списка
                this.contacts_lists[list].unshift(contact); // вставляем наверх нового списка
                contact.list = list;
                U.asyone.process(this.asyone_contacts);
                return true;
            } else {
                U.asyone.process(this.asyone_contacts_lite);
                return false;
            }
        } else return false;
    }

    addContactIfNotExists(contact_id){
        this.contacts[contact_id] || this.addContacts(contact_id, false);
    }

    setContactBackAdded(contact_id, added){
        let contact = this.contacts[contact_id];
        if(contact){
            contact.back_added = added;
            if(this.testDialogLastHistoryExists(contact_id) && added){
                this.addDialogServicePost(contact_id, ['PM_CONTACT_BACK_ADDED_YES_DIALOG']);
            }
        }
    }

    addContacts(contacts_id, added){
        U.loop.foreachSome(contacts_id, (contact_id) => {
            let contact = this.contacts[contact_id] || (this.contacts[contact_id] = {
                id : contact_id,
                added : added,
                posts : [],
                last_history_exists : false,
                unread : 0,
                last_message_time : 0,
                typing_in : 0,
                typing_out : 0,
                list : null
            });
            contact.added = added;
            this.refreshContactList(contact_id);
        });
    }

    delContact(contact_id){
        let contact = this.contacts[contact_id];
        if(contact){
            delete this.contacts[contact_id];
            contact.list && U.arr.deleteByValue(contacts_lists[contact.list], 'id', contact_id);
            U.asyone.process(this.asyone_contacts);
        }
    }

    setTypingIn(contact_id){
        let contact = this.contacts[contact_id];
        if(contact){
            contact.typing_in = U.time.stamp;
            U.asyone.process(this.asyone_contacts_lite);
            U.co.async(() => {
                U.asyone.process(this.asyone_contacts_lite);
            }, 1000 * Q.config.pm_typing_in_time);
        }
    }

    setTypingOut(){
        if(this.current_contact){
            if(U.time.stamp - this.current_contact.typing_out >= Q.config.pm_typing_out_time){
                Q.wscon.sr('set_pm_typing', { player_id : this.current_contact.id });
                this.current_contact.typing_out = U.time.stamp;
            }
        }
    }

    // Проверочки

    // Проверить не подгружали ли мы минимальную историю сообщений и вообще существует ли контакт
    testDialogLastHistoryExists(contact_id){
        return this.contacts[contact_id] && this.contacts[contact_id].last_history_exists ? true : false;
    }

    // Проверить текущий ли контакт
    testCurrentContact(contact_id){
        return this.current_contact && this.current_contact.id == contact_id ? true : false;
    }

    // Добавлен ли контакт
    testContactAdded(contact_id){
        return this.contacts[contact_id] && this.contacts[contact_id].added ? true : false;
    }

    // Сколько имеется сообщений, соответственно какой будет оффсет
    getDialogPostsLength(contact_id){
        return this.contacts[contact_id] ? this.contacts[contact_id].posts.length : 0;
    }

    // Списки

    // Сформировать списки контактов на основе всего списка (вызывается только на старте полагаю, затем вызываем refreshContactList)
    genContactsLists(){

        let contacts = U.arr.values(this.contacts);
        this.contacts_lists = { i : [], game : [], actual : [], online : [], offline : [], alien : [] };

        // -- name

        U.loop.foreach(contacts, (contact) => {
            contact.name_easy = U.text.simplify(Q.lang.parse(Q.user.getPlayerInfo(contact.id).name).toLowerCase());
        });

        contacts = U.arr.sortByParameter(contacts, 'name_easy');

        U.loop.foreach(contacts, (contact, n) => {
            contact.name_index = n + 1;
        });

        // -- time

        contacts = U.arr.sortByParameter(contacts, 'last_message_time');

        U.loop.foreach(contacts, (contact, n) => {
            contact.time_index = contact.last_message_time ? n + 1 : 0;
        });

        // -- all

        U.loop.foreach(contacts, (contact) => {
            contact.index = (contact.name_index / -10000) + (contact.time_index * 10000);
        });

        contacts = U.arr.sortByParameter(contacts, 'index').reverse();

        // -- делаем списки

        U.loop.foreach(contacts, (contact) => {
            contact.list = this.getContactListKey(contact);
            this.contacts_lists[contact.list].push(contact);
        });

        U.asyone.process(this.asyone_contacts);

    }

    // -----------

    // Открыть существующий диалог, вызывается косвенно
    openLoadedDialog(contact_id){
        this.current_contact = this.contacts[contact_id];
        this.current_contact.unread = 0;
        this.m_unread.add(contact_id, 0);
        U.asyone.process(this.asyone_contacts_lite);
        U.ev.emit(this, ST.EV_OPEN_DIALOG, contact_id);
    }

    parsePostsSource(posts_text){
        let posts = [];
        let posts_arr = posts_text.split('\n');
        posts_arr.pop();
        U.loop.foreach(posts_arr, (post_text) => {
            let post_arr = post_text.split(' ');
            posts.push(this.genPost(post_arr[1], post_arr.slice(2).join(' '), post_arr[0]));
        });
        return posts;
    }

    genPost(player_id, message, time, service = false){
        time = Number(time);
        return { player_id, message, time, service };
    }

    getContactList(contact){
        return this.contacts_lists[this.getContactListKey(contact)];
    }

    getContactListKey(contact){
        let info = Q.user.getPlayerInfo(contact.id);
        if(contact.last_message_time){
            return 'actual';
        } else if(contact.added && info.online){
            return 'online';
        } else if(contact.added && !info.online){
            return 'offline';
        } else if(!contact.added){
            return 'alien';
        }
    }

};

ST.EV_RENDER_CONTACTS = 'm_pm.render_contacts';
ST.EV_RENDER_CONTACTS_LITE = 'm_pm.render_contacts_lite';
ST.EV_ADD_POST_CURRENT = 'm_pm.add_post_current';
ST.EV_SEND_MESSAGE = 'm_pm.send_message';
ST.EV_OPEN_DIALOG = 'm_pm.open_dialog';
