let ST = phys_Messages = class extends phys_Div {

    constructor(){

        super(Q.config.padding_x2);

        this.c_bg = new phys_Rect(0xFFFFFF).to(this.c_content_down);
        this.c_roll = new phys_Roll(phys_Messages_Element, phys_Roll.ORIENTATION_Y).to(this.c_content);
        this.c_roll.alignment = phys_Roll.ALIGNMENT_BOTTOM;

        U.ev.listen(this.v, 'sizes', () => {
            U.ev.emitSizes(this.c_bg.v, this);
            U.ev.emitSizes(this.c_roll.v, this.csizes);
        });

    }

    addPosts(posts){

        posts = posts instanceof Array ? U.arr.clone(posts) : [posts];

        // Разделитель времени

        let prev_post = this.c_roll.getLastItem(), split;

        U.loop.foreach(posts, (post, n) => {
            if(!prev_post || (!prev_post.split && U.time.testDaysDifferent(post.time, prev_post.time))){
                if(U.time.testToday(post.time)){
                    split = ['DATE_TODAY'];
                } else if(U.time.testYesterday(post.time)){
                    split = ['DATE_YESTERDAY'];
                } else split = U.time.toTextYMD(post.time);
                posts.splice(n, 0, { split });
            }
            prev_post = post;
        });

        // Добавить посты в c_roll

        this.c_roll.addItemToEnd(posts);

        // Скроллить при необходимости

        if(!this.c_roll.scrolling){
            let sp = this.c_roll.getScrollParameters();
            if(sp.full && sp.bottom_space >= 0 && sp.bottom_space <= 5){
                this.c_roll.smoothScroll(-1);
            }
        }

    }

};
