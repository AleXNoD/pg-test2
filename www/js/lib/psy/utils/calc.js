let ST = psy_Util_Calc = class {

    random(a, b = null){
        if (b === null) {
			b = a;
			a = 0;
		}
		return a + Math.floor(Math.random() * (b - a));
	}

    int(a){
        return Math.abs(Math.floor(Number(a)));
    }

    sign(a){
        return a > 0 ? 1 : -1;
    }

    randomRange(a, b, count){
		if(count > 0 && b - a >= count){
			let index = {};
			let sequence = [];
			let length = 0;
			while(length < count){
				let r = this.random(a, b);
				if(!index[r]){
					sequence.push(r);
					index[r] = true;
					length++;
				}
			}
			return sequence;
		} else return [];
	}

    fringe(a, min, max){
        a = this.fringeMin(a, min);
        a = this.fringeMax(a, max);
        return a;
    }

    fringeMax(a, max){
        a = Number(a);
        a > max && (a = max);
        return a;
    }

    fringeMin(a, min){
        a = Number(a);
        a < min && (a = min);
        return a;
    }

    xsin(speed, radians) {
        return speed * Math.sin(radians);
    }

    ycos(speed, radians) {
        return -speed * Math.cos(radians);
    }

    radians(rotation) {
        return rotation * (Math.PI / 180);
    }

    rotation(radians) {
        return radians * (180 / Math.PI);
    }

    rotationDelta(rotation1, rotation2) {
        let a = Math.abs(rotation1 - rotation2);
        return a > 180 ? 360 - a : a;
    }

    angle(pointB, pointA) {
        return -Math.atan2(pointB.x - pointA.x, pointB.y - pointA.y);
    }

    distance(deltaX, deltaY) {
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }

}
