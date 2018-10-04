let ST = phys_Div = class extends phys_Base {

    constructor(margin = 0, margin_positron = null){

        super();

        this.m_positron = new psy_Positron;

        this.content_width = 0;
        this.content_height = 0;
        this.csizes = { width : 0, height : 0 };

        this.c_content_down = new phys_Base().to(this);
        this.c_content = new phys_Base().to(this);

        U.ev.listen(this.v, 'sizes', () => {
            this.content_width = this.csizes.width = this.getContentHorisontalSize(this.width);
            this.content_height = this.csizes.height = this.getContentVerticalSize(this.height);
            U.ev.emitSizes(this.c_content.v, this.csizes);
            U.ev.emitSizes(this.c_content_down.v, this);
        });

        this.setMarginPositron(margin_positron === null ? margin : margin_positron);
        this.setMargin(margin);

    }

    setMargin(margin, top = true, right = true, bottom = true, left = true){
        this.margin = margin;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.c_content.v.x = left ? margin : 0;
        this.c_content.v.y = top ? margin : 0;
        U.ev.emitSizes(this.v);
    }

    setMarginPositron(margin){
        this.m_positron.margin = margin;
    }

    getMarginHorisontalSize(){
        return (this.left ? this.margin : 0) + (this.right ? this.margin : 0);
    }

    getMarginVerticalSize(){
        return (this.top ? this.margin : 0) + (this.bottom ? this.margin : 0);
    }

    getContentHorisontalSize(size){
        return size - this.getMarginHorisontalSize();
    }

    getContentVerticalSize(size){
        return size - this.getMarginVerticalSize();
    }

    getHorizontalSize(size = null){
        return this.getMarginHorisontalSize() + (size === null ? this.m_positron.point.x : size);
    }

    getVerticalSize(size = null){
        return this.getMarginVerticalSize() + (size === null ? this.m_positron.point.y : size);
    }

    clear(){
        this.c_content_down.v.removeChildren();
        this.c_content.v.removeChildren();
        this.m_positron.clear();
    }

}
