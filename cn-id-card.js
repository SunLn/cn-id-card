/*

    15位的身份证号 dddddd yymmdd xx p
    18位的身份证号 dddddd yyyymmdd xx p y
    其中dddddd为地址码（省地县三级）18位中的和15位中的不完全相同
    yyyymmdd yymmdd 为出生年月日
    xx顺号类编码
    p性别

*/
function YearHou(year) {
	this.year =  year;
}

YearHou.prototype.is00 = function () {
	return this.year>= 2000
}

YearHou.prototype.is90 = function() {
	return this.year < 2000 && this.year>= 1990
};

YearHou.prototype.is80 = function() {
	return this.year < 1990 && this.year>= 1980
};

YearHou.prototype.is70 = function() {
	return this.year < 1980 && this.year>= 1970
};

YearHou.prototype.is60 = function() {
	return this.year < 1970 && this.year>= 1960
};

YearHou.prototype.isBefore60 = function() {
	return this.year < 1960
};

exports.isNewIdCard = function(id_card){
	return id_card.length === 18
}

exports.isOldIdCard = function(id_card){
	return id_card.length === 16
}


exports.getYear = function (id_card) {
	if(!id_card) {
		return ''
	}
	var year = ''
	if (this.isOldIdCard(id_card)) {
        //old id card
        year =  '19' + id_card.substr(6,2);
    } else {
        // new id card
        year =  id_card.substr(6,4);
    }
    year = Number(year)

    return new YearHou(year);
}

exports.getGender = function(id_card) {
	if(!id_card) {
		return 'male'
	}
    var gender = 'male';

    var genderNum;

    if (this.isOldIdCard(id_card)) {
        //old id card
        genderNum =  id_card.substr(15,1);
    } else {
        // new id card
        genderNum =  id_card.substr(16,1);
    }

    if(genderNum%2===0) {
        gender = 'female';
    }
    return gender;
}


module.exports = exports
