let ST = psy_Gate = class {

    constructor(callback = null){

        this.error = (r) => {
            new phys_Win_Error(r.text);
        };

        this.alert = (r) => {
            new phys_Win_Alert(r.title || '', r.text, [[['CLOSE']]]);
        };

        this.send_online = (r) => {
        };

        this.send_players_info = (r) => {
            Q.player.addInfos(r.infos);
        };

        this.send_player_id = (r) => {
            Q.st.player_id = r.player_id;
            Q.user.link(Q.st.player_id, Q.vk.locvars.viewer_id);
        };

        this.send_ms = (r) => {
            U.time.external_ms = r.ms;
        };

        this.config = (r) => {
            Q.st.config = r.config;
            Q.st.emit(psy_Storage.EV_CONFIG);
        };

        this.fcon_close_signal = (r) => {
            Q.st.server_close_signal = r.signal;
        };

        this.ready = (r) => {
            Q.core.launch();
        };

        this.start = (r) => {
            Q.main.draw();
            Q.pm.init();
        };

        // chat

        this.send_chat_posts = (r) => {
            let c_messages = Q.main.c_frames.frames_c.chat.c_messages;
            r.clear && c_messages.c_roll.terminate();
            c_messages.addPosts(r.posts);
            r.clear && c_messages.c_roll.scrollBottom();
        };

        this.send_chats = (r) => {
            U.loop.foreach(r.chats, (info, id) => {
                Q.chat.addInfo(id, info);
            });
        };

        this.send_chat_info = (r) => {
            Q.chat.addInfo(r.id, r.info);
        };

        // pm

        this.add_pm_contacts = (r) => {
            Q.pm.addContacts(r.contacts_id, r.added ? true : false);
        };

        this.add_pm_contacts_captions = (r) => {
            Q.pm.addContacts(U.arr.keys(r.contacts), true);
        };

        this.send_pm_dialog_posts = (r) => {
            Q.pm.addDialogPostsSource(r.player_id, r.dialog);
        };

        this.send_pm_message = (r) => {
            Q.pm.addDialogPost(r.player_id == Q.st.player_id ? r.to_player_id : r.player_id, r.player_id, r.message, r.time);
        };

        this.send_pm_buffers = (r) => {
            U.loop.foreach(r.buffers, (buffer) => {
                Q.pm.addContactUnread(buffer.player_id, buffer.count, buffer.time);
            });
        };

        this.set_pm_typing = (r) => {
            Q.pm.setTypingIn(r.player_id);
        };

        // Lenta

        this.send_lentas = function(dm) {
            U.loop.foreach(dm.lentas, (item) => {
                Q.lenta.add(U.arr.fillArray(item, item.count));
            });
        };

        this.del_lenta = function(dm) {
            Q.lenta.del();
        };

    }

};


/*
package m {

	import c.*;
	import com.alexnod.modules.*;
	import com.alexnod.utils.*;

	public class m_Gate extends gm_Basis {

		public var gate = {};

		public function m_Gate() {

			gate.get_player_info = function(dm) {
				M.player.send_initial_info();
			};

			gate.start = function(dm) {
				C.main.make_c_2();
				C.pm.extract_so();
			};

			// Radio

			gate.send_radio_air = function(dm) {
				C.radio && Dispatch.item(C.radio.v, dm.radio);
			};

			gate.invite_radio_coplayer = function(dm) {
				new c_Win_Alert('', ['RADIO_INVITE_COPLAYER_REQUEST'], [[['RADIO_INVITE_COPLAYER_REQUEST_BUT'], function() {
					M.req.accept_radio_coplayer();
				}]]);
			};

			gate.animate_radio_rating = function(dm){
				//C.radio.animate_rating(dm.rating);
			};

			// Konkurs

			gate.activate_konkurs_results = function(){
				var c_menu = C.menu.menu_c['konkurs'];
				Dispatch.item(c_menu.v, { name : ['MENU_KONKURSR'], unit : 'konkursr', color : 0xFFFFFF });
			};

			// Game

			gate.send_game = function(dm) {
				C.join.joining = false; // джойн больше не актуален
				M.game.set_current(dm.game.type); // устанавливаем контроллер
				M.game.dispatch_game(dm.game); // диспатчим игру в текущий контроллер
				M.game.auto_show_current(); // показываем все игры сразу, кроме поцелуев
				C.join.render(); // рендер джойна
			};

			gate.end_game = function(dm) {
				M.game.dispatch_end(); // диспатчим энд на текущую игру
				M.game.set_current(null); // равняем игру в ноль
				C.join.render(); // рендер джойна
				Co.async(function() {
					M.game.name === null && M.tytorial.make_random_forcing(2);
				}, 2000);
				Co.async(function() {
					if (C.join.autojoin && So.read_key(M.config.so_settings, 'autojoin') && !M.user.current.player.info.noob && M.game.name === null){
						C.join.c_button_start.call_handler();
					}
				});
			};

			gate.send_game_ready = function(dm) {
				M.game.dispatch_ready(dm.player_id, dm.value); // диспатчим рэди в текущий контроллер
			};

			gate.flow_game_gift = function(dm) {
				M.game.dispatch_gift(dm.pgift);
			};

			// Game Team

			gate.invite_game_pick_team = function(dm){
				C.pm.add_dialog_service_post(dm.player_id, ['PM_INVITE_GAME_PICK_TEAM', M.player.gen_tag_name(dm.player_id), dm.player_id], true);
			};

			gate.send_game_pick_team = function(dm){
				M.storage.pick_team = dm.team;
				C.winbox.refresh_win('game_pick_team');
				C.join.render();
			};

			gate.del_game_pick_team = function(dm){
				if (Arr.area_in(X.player_id, dm.players_id)){
					M.storage.pick_team.players_id = {};
					M.storage.pick_team.count = 0;
					M.storage.pick_team.owner_id = 0;
				} else {
					Loop.foreach(dm.players_id, function(player_id){
						if (M.storage.pick_team.players_id[player_id]){
							delete M.storage.pick_team.players_id[player_id];
							M.storage.pick_team.count--;
						}
					});
				}
				C.winbox.refresh_win('game_pick_team');
				C.join.render();
			};

			gate.send_game_pick_team_count = function(dm){
				if (M.storage.pick_team.players_id[dm.player_id]){
					M.storage.pick_team.counters[dm.player_id] = dm.count;
					C.winbox.refresh_win('game_pick_team');
				}
			};

			// Kingdom

			gate.send_kingdom = function(dm) {
				Arr.eq_by_key(dm.kingdom, M.storage.kingdom_index, 'player_id');
				C.kingdom.refresh();
			};

			gate.send_kingdom_message = function(dm) {
				C.kingdom.add_message(dm.player_id, dm.message);
			};

			// Bonus

			gate.bonus_get = function(dm) {
				new c_Win_Bonus(dm.bonus.level, dm.bonus.money);
			};

			gate.bonus_notify = function(dm) {
				if (!M.user.current.player.info.noob) {
					new c_Starbonus_Fly(dm.bonus.level, dm.bonus.money);
				} else {
					Co.async(function() {
						new c_Starbonus_Fly(dm.bonus.level, dm.bonus.money);
					}, 1000 * 30);
				}
			};

			// Gifts

			gate.send_pgift = function(dm) {
				C.gifts.add_gift(dm.box, dm.pgift);
			};

			// Ignores

			gate.send_blacklist = function(dm) {
				Loop.foreach(dm.players_id, function(player_id) {
					if (dm.yes) {
						M.storage.blacklist[player_id] = true;
					} else if (M.storage.blacklist[player_id]) {
						delete M.storage.blacklist[player_id];
					}
				});
			};

			gate.send_blacklist_ignored = function(dm) {
				C.pm.add_dialog_service_post(dm.player_id, ['DIALOG_BLACKLISTED']);
			};

			// Money

			gate.add_money = function(dm){
				new c_Win_Money_Incoming(dm.money, dm.type);
			};

			// Punish

			gate.send_punish = function(dm) {
				dm.punish.agent_id = dm.agent_id;
				new c_Win_Punish_Alert(dm.punish);
			};

			// Macros

			gate.send_macros = function(dm){
				M.storage.macros = dm.macros;
			};

			// Stars

			gate.send_stars = function(dm){
				C.stars.add(dm.stars);
			};

			// Players

			gate.send_players_info = function(dm) {
				M.player.add_players_info(dm.infos);
			};

			gate.send_players_info_online = function(dm) {
				Loop.foreach(dm.players_id, function(player_id) {
					M.player.add_player_info(player_id, { online : 1 } );
				});
			};

			gate.send_player_ext_info = function(dm) {
				M.user.add_player(dm.player_id);
				M.user.set_parameters(dm.info, dm.player_id);
			};

			gate.send_online = function(dm) {
				C.onlines && Dispatch.item(C.onlines.v, dm.online);
			};

			gate.send_guest = function(dm) {
				M.storage.views.inbox.unshift({player_id:dm.player_id, invis:dm.invis});
				C.mirror.add_guest();
				C.winbox.refresh_win('views');
			};

			gate.transfer = function(dm){
				M.storage.transfers.unshift(dm.transfer);
				M.storage.transfers_index[dm.transfer.id] = dm.transfer;
				dm.transfer.to_player_id == X.player_id && C.purse.c_animation.start(true);
				C.winbox.refresh_win('transfers');
			};

			gate.transfer_status = function(dm){
				M.storage.transfers_index[dm.transfer.id] && Co.eq(M.storage.transfers_index[dm.transfer.id], dm.transfer);
				C.winbox.refresh_win('transfers');
			};

			// Chat

			gate.send_chats = function(dm) {
				C.chat && C.chat.c_list.add_sequence(dm.chats);
			};

			gate.send_chat_info = function(dm) {
				var chat = C.chat.chats[dm.id] || (C.chat.chats[dm.id] = { } );
				Co.eq(chat, dm.info);
				if (M.user.current.player.info.chat == dm.id) {
					C.chat.refresh_chat_pic();
				}
			};

			gate.send_chat_posts = function(dm) {
				dm.clear && C.chat.c_messages.clear();
				C.chat.add_post(dm.posts);
			};

			gate.send_chat_title = function(dm) {
				C.chat.set_title(dm.title);
			};

			gate.incr_chat_counter = function(dm){
				if (C.chat.c_list.elements_chat_c[dm.chat_id]){
					var chat = C.chat.chats[dm.chat_id] || (C.chat.chats[dm.chat_id] = { counter : 0 } );
					chat.counter += 1;
					Dispatch.refresh(C.chat.c_list.v);
				}
			};

			// PM

			gate.send_pm_contact_back_added = function(dm){
				C.pm.set_contact_back_added(dm.player_id, dm.added ? true : false);
			};

			gate.add_pm_contacts = function(dm) {
				C.pm.add_contacts(dm.contacts_id, dm.added ? true : false, false);
				C.pm.render_contacts();
			};

			gate.add_pm_contacts_captions = function(dm){
				C.pm.add_contacts(Arr.keys(dm.contacts), true, false);
				C.pm.add_contacts_captions(dm.contacts);
				C.pm.render_contacts();
			};

			gate.send_pm_dialog_posts = function(dm) {
				C.pm.add_dialog_posts(dm.player_id, dm.dialog);
			};

			gate.send_pm_message = function(dm) {
				C.pm.add_dialog_post(dm.player_id == M.user.current.player.id ? dm.to_player_id : dm.player_id, dm.player_id, dm.message, dm.time);
			};

			gate.send_pm_buffers = function(dm){
				Loop.foreach(dm.buffers, function(buffer) {
					C.pm.add_contact_unread(buffer.player_id, buffer.count, buffer.time, false);
				});
				C.pm.render_contacts();
			};

			gate.set_pm_typing = function(dm) {
				C.pm.set_typing(dm.player_id);
			};

			// PM Game

			gate.send_pm_game = function(dm) {
				C.pm.set_game(dm.yes);
			};

			gate.send_pm_game_message = function(dm) {
				C.pm.add_game_dialog_post(dm.message);
			};

			gate.set_pm_game_typing = function(dm) {
				C.pm.set_game_typing();
			};

			// Missions

			gate.send_missions = function(dm) {
				Co.eq(M.storage.missions, dm.missions);
			};

			gate.send_missions_tasks = function(dm) {
				C.missions.add(dm.tasks, dm.fresh);
			};

			gate.incr_mission_task = function(dm) {
				C.missions.incr(dm.mission_id, dm.count);
			};

			// Mafia

			gate.send_mafia_local_players = function(dm){
				M.mafia.add_local_players(dm.local_players);
			};

			gate.del_mafia_player = function(dm){
				M.mafia.del_local_player(dm.player_id);
			};

		}

	}

}

*/
