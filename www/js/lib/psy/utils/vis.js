let ST = psy_Util_Vis = class {

    kill(v){
        if(v){
    		U.ev.emit(v, 'kill');
            this.killChildren(v);
            v.destroy();
        }
	}

    killChildren(v){
        v && U.loop.foreach(v.children.slice(0), (child) => {
            this.kill(child);
        });
    }

}
