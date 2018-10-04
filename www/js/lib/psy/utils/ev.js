let ST = psy_Util_Ev = class {

    listen(emitter, event, callback, phys = null){
        emitter = U.arr.forceMake(emitter);
        event = U.arr.forceMake(event);
        U.loop.foreach(emitter, (emitter) => {
            U.loop.foreach(event, (event) => {
                emitter.addListener ? emitter.addListener(event, callback) : emitter.addEventListener(event, callback);
            });
        });
        let evi = { emitter, event, callback };
        phys && phys.addEvi(evi);
        return evi;
    }

    listenSizes(emitter, callback, phys = null){
        this.listen(emitter, 'sizes', callback, phys);
    }

    transfer(event, emitter_from, emitter_to){
        this.listen(emitter_from, event, (data) => {
            this.emit(emitter_to, event, data);
        });
    }

    removeEvi(evi){
        evi && U.loop.foreach(evi.emitter, (emitter) => {
            U.loop.foreach(evi.event, (event) => {
                emitter.removeListener ? emitter.removeListener(event, evi.callback) : emitter.removeEventListener(event, evi.callback);
            });
        });
    }

    emit(emitter, event, data = null){
        emitter && emitter.emit(event, data);
    }

    emitSizes(emitter, width = null, height = null){
        if(width instanceof phys_Base || (width && typeof width == 'object' && width.width !== undefined && width.height !== undefined)){
            height = width.height;
            width = width.width;
        }
        this.emit(emitter, 'sizes', { width, height });
    }

}
