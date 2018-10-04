let ST = psy_Util_Time = class {

    constructor(){
        this.external_ms = 0;
        this.stamp = 0;
        this.updateStamp();
        setInterval(()=>{
            this.updateStamp();
        }, 1000);
    }

    getMs(){
		return new Date().getTime();
	}

    getDays(seconds){
		return Math.floor((seconds || this.stamp) / (3600 * 24));
	}

    getHours(seconds){
		return Math.floor((seconds || this.stamp) / (3600));
	}

    toTextYMD(seconds, splitter = '/'){
        let date = new Date(seconds * 1000);
        return U.text.symBefore(date.getFullYear()) + splitter + U.text.symBefore(date.getMonth() + 1) + splitter + U.text.symBefore(date.getDate());
    }

    toTextHM(seconds, splitter = ':'){
        let date = new Date(seconds * 1000);
        return U.text.symBefore(date.getHours()) + splitter + U.text.symBefore(date.getMinutes());
    }

    toTextHMS(seconds, splitter = ':'){
        let date = new Date(seconds * 1000);
        return U.text.symBefore(date.getHours()) + splitter + U.text.symBefore(date.getMinutes()) + U.text.symBefore(date.getSeconds());
    }

    testToday(seconds){
        let datec = new Date();
		let date = new Date(seconds * 1000);
		return date.getFullYear() == datec.getFullYear() && date.getMonth() == datec.getMonth() && date.getDate() == datec.getDate();
    }

    testYesterday(seconds){
        let datec = new Date();
		let date = new Date(seconds * 1000);
		return this.stamp - seconds <= 3600 * 24 * 2 && (datec.getDay() - date.getDay() == 1 || (datec.getDay() == 0 && date.getDay() == 6));
    }

    testYesterdayPast(seconds){
        let datec = new Date();
		let date = new Date(seconds * 1000);
		return date.getFullYear() == datec.getFullYear() && date.getMonth() == datec.getMonth() && Math.abs(date.getDate() - datec.getDate()) == 2;
    }

    testDaysDifferent(seconds1, seconds2){
        let date1 = new Date(seconds1 * 1000);
        let date2 = new Date(seconds2 * 1000);
        return date1.getFullYear() != date2.getFullYear() || date1.getMonth() != date2.getMonth() || date1.getDate() != date2.getDate();
    }

    updateStamp(){
        this.stamp = Math.floor(this.getMs() / 1000);
    }

}
