let ST = psy_Util_Color = class {

    multiply(color, factor){
        let rgb = this.extract(color);
        return this.combine(U.calc.fringe(rgb.r * factor, 0, 255), U.calc.fringe(rgb.g * factor, 0, 255), U.calc.fringe(rgb.b * factor, 0, 255));
    }

    extract(color){
        return { r : color >> 16, g : color >> 8 & 0xFF, b : color & 0xFF };
    }

    combine(r, g, b){
        return r << 16 | g << 8 | b;
    }

    testDark(color, percent = 0.8){
        return color === 'invis' ? false : this.getMedium(color) <= 0xFF * percent;
    }

    getMedium(color){
        let rgb = this.extract(color);
        return (rgb.r + rgb.g + rgb.b) / 3;
    }

    hexToString(color){
        return Number(color).toString(16);
    }

    stringToHex(colorstr){
        colorstr = String(colorstr);
        return Number('0x'+colorstr);
    }

};
