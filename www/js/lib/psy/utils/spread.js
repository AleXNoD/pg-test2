let ST = psy_Util_Spread = class {

    constructor(){
        this.point_assoc_size = { x : 'width', y : 'height' };
        this.point_assoc_anti = { x : 'y', y : 'x' };
    }

    // Расположить все объекты по фиксированной площади, изменив их размер. Вернуть размер каждого елемента.
    inResize(margin, elements_c, width, height, dimension, percents = []){

        elements_c = U.arr.values(elements_c);
        let size = dimension == 'x' ? width : height;
        let full_size = size;
        let elements_stek_length = elements_c.length;

        U.loop.foreach(percents, (percent, k) => {
            size -= Math.round(size * percent);
            elements_stek_length--;
        });

        // Ширина всех отступов
        let margins_size = margin * (elements_c.length - 1);
        // Ширина для элементов
        let free_size = size - margins_size;
        // Точная ширина одного элемента
        let element_size = free_size / elements_stek_length;
        // Округлённая ширина элемента
        let floor_element_size = Math.floor(element_size);
        // Добавочная ширина последнего элемента
        let last_element_extra_size = free_size - floor_element_size * elements_stek_length;

        let c_element_prev, c_element_prev_size, c_element_prev_position;
        U.loop.foreach(elements_c, (c_element, k) => {
            let c_element_position = c_element_prev ? c_element_prev_position + c_element_prev_size + margin : 0;
            c_element && (c_element.v[dimension] = c_element_position);
            let c_element_size = c_element_prev_size = percents[k] ? Math.round(full_size * percents[k]) : (k == elements_c.length - 1 ? floor_element_size + last_element_extra_size : floor_element_size);
            c_element && U.ev.emitSizes(c_element.v, dimension == 'x' ? c_element_size : width, dimension == 'y' ? c_element_size : height);
            c_element_prev = c_element || true;
            c_element_prev_position = c_element_position;
        });

        return floor_element_size;

    }

    // Расположить все объекты фиксированного размера. Вернуть суммарную площадь.
    inPlacement(margin, elements_c, element_width, element_height, dimension){

        elements_c = U.arr.values(elements_c);
        let size = dimension == 'x' ? element_width : element_height;

        let c_element_prev;
        U.loop.foreach(elements_c, (c_element, k) => {
            c_element.v[dimension] = c_element_prev ? c_element_prev.v[dimension] + size + margin : 0;
            U.ev.emitSizes(c_element.v, element_width, element_height);
            c_element_prev = c_element;
        });

        return (elements_c.length ? margin * (elements_c.length - 1) : 0) + elements_c.length * size;

    }

}
