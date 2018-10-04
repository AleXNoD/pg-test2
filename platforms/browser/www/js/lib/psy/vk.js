let ST = psy_VK = class extends psy_EventEmitter {

    constructor(callback_init = null){
        super();
        this.api_version = '5.80';
        this.m_queue = new psy_Queue;
        this.access_token = null;
        this.locvars = {};
        this.parseLocation();
        this.access_token = this.locvars.access_token;
        this.jsonp_callback_counter = 0;
        if(window.parent === window){
            this.con_type = ST.CON_TYPE_JSONP;
            U.co.exe(callback_init);
        } else {
            this.con_type = ST.CON_TYPE_NATIVE;
            VK.init(() => {
                U.co.exe(callback_init);
            }, () => {
            }, this.api_version);
        }
    }

    api(method, parameters){
        let pack = { method, parameters, cursor : true };
        this.m_queue.add(pack, (pack, callback) => {
            pack.parameters.v === undefined && (pack.parameters.v = this.api_version);
            pack.parameters.random = U.calc.random(100000000, 999999999);
            pack.parameters.access_token = this.access_token;
            let query = pack.method + U.net.compileQueryget(pack.parameters);
            U.ev.emit(this.v, ST.EV_SEND, query);
            pack.cursor && U.ev.emit(this.v, ST.EV_CURSOR, true);
            if(this.con_type == ST.CON_TYPE_NATIVE){
                VK.api(pack.method, pack.parameters, (result) => {
                    this.handleResult(pack, result);
                    U.co.exe(callback);
                });
            } else if(this.con_type == ST.CON_TYPE_JSONP){
                let jsonp_callback_name = 'vk_jsonp_callback' + (++this.jsonp_callback_counter);
                let htmlscript = document.createElement("script");
                window[jsonp_callback_name] = (result) => {
                    delete window[jsonp_callback_name];
                    document.head.removeChild(htmlscript);
                    this.handleResult(pack, result);
                    U.co.exe(callback);
                };
                htmlscript.src = 'https://api.vk.com/method/' + query + '&callback='+jsonp_callback_name;
                document.head.appendChild(htmlscript);
            } else {
                U.net.request('https://api.vk.com/method/' + query, (result_json) => {
                    let result = U.json.decode(result_json);
                    this.handleResult(pack, result);
                    U.co.exe(callback);
                }, (error_code) => {
                    U.ev.emit(this.v, ST.EV_CURSOR, false);
                    let error = { code : 0, text : 'Network error' };
                    U.ev.emit(this.v, ST.EV_ERROR, error);
                    U.co.exe(pack.callback_error, error);
                    U.co.exe(callback);
                });
            }
        });
        let return_f = {
            cb : (callback) => {
                pack.callback = callback;
                return return_f;
            },
            error : (callback) => {
                pack.callback_error = callback;
                return return_f;
            },
            cursor : (yes) => {
                pack.cursor = yes;
                return return_f;
            }
        };
        return return_f;
    }

    parseLocation(){
        let text = String(document.location).split('?')[1];
        if(text){
            let [qs, anchor] = text.split('#');
            U.loop.foreach(qs.split('&'), (qs_item) => {
                let [key, value] = qs_item.split('=');
                this.locvars[key] = value;
            });
        }
    }

    handleResult(pack, result){
        U.ev.emit(this.v, ST.EV_CURSOR, false);
        U.ev.emit(this.v, ST.EV_GET, result);
        if(!result || result.error){
            let error = result ? { code : result.error.error_code, text : result.error.error_msg } : { code : 0, text : 'No result error' };
            U.ev.emit(this.v, ST.EV_ERROR, error);
            U.co.exe(pack.callback_error, error);
        } else {
            U.ev.emit(this.v, ST.EV_SUCCESS, result.response);
            U.co.exe(pack.callback, result.response);
        }
    }

};

ST.EV_SEND = 'vk-rest.send';
ST.EV_CURSOR = 'vk-rest.cursor';
ST.EV_GET = 'vk-rest.get';
ST.EV_ERROR = 'vk-rest.error';
ST.EV_SUCCESS = 'vk-rest.success';

ST.CON_TYPE_NATIVE = 1;
ST.CON_TYPE_XHR = 2;
ST.CON_TYPE_JSONP = 3;
