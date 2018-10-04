let ST = psy_Util_Net = class {

    request(url, callback, callback_error = null, callback_progress = null, post_data = null, response_type = 'text'){
        let xhr = new XMLHttpRequest();
        callback_error && (xhr.onerror = callback_error);
        callback_progress && (xhr.onprogress = callback_progress);
        try { xhr.responseType = response_type } catch (e) {};
        xhr.open(post_data ? 'POST' : 'GET', url, true);
        xhr.send(post_data);
        xhr.onload = () => {
            if(xhr.status == 200 || xhr.status == 304){
                U.co.exe(callback, xhr.response);
            } else U.co.exe(callback_error, xhr.status);
        };
        return xhr;
    }

    compileQueryget(parameters){
        let array = [];
        U.loop.foreach(parameters, (value, key) => {
            array.push(key + '=' + encodeURIComponent(value));
        });
        return '?' + array.join('&');
    }

    navigate(url){
        window.open(url, '_blank');
    }

}
