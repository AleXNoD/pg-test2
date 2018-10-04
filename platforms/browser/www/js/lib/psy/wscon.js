let ST = psy_Wscon = class {

	constructor(){
		this.ws = null;
		this.active = false;
		this.gate = {};
		this.request_count = 0;
		this.requests = {};
		this.splitter = '/';
	}

	connect(host, port, callback, ssl, gate){
		this.gate = gate || {};
		this.ws = new WebSocket('ws'+(ssl ? 's' : '')+'://'+host+':'+port);
		this.ws.onopen = (event) => {
			console.log('wscon connected');
			this.active = true;
			U.co.exe(callback);
		};
		this.ws.onmessage = (e) => {
			this.parse(e.data);
		};
		this.ws.onclose = (e) => {
			this.active = false;
			console.log('wscon close');
		};
		this.ws.onerror = (e) => {
			console.log('wscon error', e);
		};
	}

	sendRequest(method, parameters){
		let anchor = ++this.request_count;
		let request = {};
		this.requests[anchor] = request;
		let pack = this.genPack(method, parameters, anchor);
		this.send(pack);
		return {
			cb : (callback) => {
				request.callback = callback;
			}
		};
	}

	sr(method, parameters){
		return this.sendRequest(method, parameters);
	}

	send(pack){
		//console.log(pack);
		this.active && this.ws.send(pack);
	}

	genPack(method, parameters, anchor){
		parameters || (parameters = {});
		let pack = method + this.splitter + anchor + this.splitter + U.json.encode(parameters);
		return pack;
	}

	parse(pack){
		//console.log(pack);
		let array = pack.split(this.splitter);
		let method = array[0];
		let json = array.slice(2).join(this.splitter);
		let parameters = U.json.decode(json);
		if(method){
			if(method == '#callback'){
				let anchor = parameters.anchor;
				let request = this.requests[anchor];
				if(request){
					parameters.success && U.co.exe(request.callback, parameters.parameters);
					delete this.requests[anchor];
				}
			} else {
				if(this.gate[method]){
					U.co.exe(this.gate[method], parameters);
				}
			}
		}
	}

}
