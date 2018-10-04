let ST = psy_Util_Texture = class {

    constructor(){

        this.ssl = true;
        this.cache = {};
        this.time_destroy = 60;
        this._interval = null;

    }

    initInterval(){
        this._interval || (this._interval = setInterval(() => {
            U.loop.foreach(this.cache, (cache, url) => {
                if(cache.use == 0){
                    let delta = U.time.stamp - cache.time;
                    if(delta >= this.time_destroy){
                        cache.bt.dispose();
                        PIXI.BaseTexture.removeFromCache(cache.bt);
                        cache.bt.destroy();
                        delete this.cache[url];
                    }
                }
            });
        }, 1000 * 50));
    }

    clear(url){
        let cache = this.cache[url];
        if(cache){
            cache.use--;
            cache.time = U.time.stamp;
        }
    }

    use(url){
        let cache = this.cache[url];
        if(cache){
            cache.use++;
            cache.time = U.time.stamp;
            return cache.bt;
        } else return null;
    }

    load(url, callback, callback_error = null){
        this.initInterval();
        url = this.replaceVKUrl(url);
        this.ssl && (url = U.text.replace(url, 'http://', 'https://'));
        U.atom.begin('loadpixitexture_'+url, (key) => {
            if(this.cache[url]){
                U.atom.exe(key, callback, this.cache[url].bt);
            } else {
                let bt = new PIXI.BaseTexture.from(url, PIXI.SCALE_MODES.LINEAR);
                U.ev.listen(bt, 'loaded', () => {
                    this.cache[url] = { bt : bt, time : U.time.stamp, use : 0 };
                    bt.removeAllListeners();
                    U.atom.exe(key, callback, url);
                });
                U.ev.listen(bt, 'error', () => {
                    bt.removeAllListeners();
                    U.atom.exe(key, callback_error);
                });
            }
        });
    }

    replaceVKUrl(url){
        url = url.replace(/https?\:\/\/cs[0-9a-z-]+\.(?:vk\.me|userapi\.com|vk\.com)\/(c[0-9]+\/v[0-9]+\/.+?)\.jpg/g, 'http://pp.userapi.com/$1.jpg');
		url = url.replace(/https?\:\/\/cs([0-9a-z-]+)\.(?:vk\.me|userapi\.com|vk\.com)\/(.+?)\.jpg/g, 'http://pp.userapi.com/c$1/$2.jpg');
		url = url.replace(/https?\:\/\/pp\.vk\.me\/(.+?)\.jpg/g, 'http://pp.userapi.com/$1.jpg');
        return url;
    }

}
