let ST = psy_CursorCSS = class {

    constructor(){
        this.initCss();
        this.keys = new Set;
    }

    initCss(){
        let css = document.createElement("style");
        let keyframes = '';
        let frames_length = 30;
        U.loop.forn(frames_length, (frame) => {
            keyframes += Math.round((frame / (frames_length - 1)) * 100)+'% { cursor: url("./res/image/cursor/cursor'+frame+'.png") 9 9, auto;}';
        });
        css.innerHTML = '.cursorAnimation{animation: animateCursor 0.7s infinite;} @keyframes animateCursor {'+keyframes+'}';
        document.head.appendChild(css);
    }

    display(){
        if(this.keys.size > 0){
            Q.main.v.interactiveChildren = false;
            document.body.className = 'cursorAnimation';
        } else {
            Q.main.v.interactiveChildren = true;
            document.body.className = '';
        }
    }

    show(key){
        this.keys.add(key);
        this.display();
    }

    hide(key){
        this.keys.delete(key);
        this.display();
    }

}
