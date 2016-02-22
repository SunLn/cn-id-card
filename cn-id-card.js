/*
    18位的身份证号 dddddd yyyymmdd xx p y
    其中dddddd为地址码（省地县三级）18位中的和15位中的不完全相同
    yyyymmdd yymmdd 为出生年月日
    xx顺号类编码
    p性别
*/

var moment = require('moment');
var province = require('./data/id_card_province');

var errInfo = {
    'empty': {
        err_code: 4000,
        err_message: '空身份证'
    },
    'too_long': {
        err_code: 4001,
        err_message: '身份证长度过长'
    },
    'too_short': {
        err_code: 4002,
        err_message: '身份证长度过短'
    },
    'not_born': {
        err_code: 4003,
        err_message: '出生日期大于当前日期'
    },
    'invalid_place': {
        err_code: 4004,
        err_message: '无效的地址'
    },
    'invalid_tail': {
        err_code: 4005,
        err_message: '身份证尾号和默认生成的尾号不匹配'
    },
    'err_format': {
        err_code: 4006,
        err_message: '身份证格式不正确'
    },
    'err_birthday': {
        err_code: 4007,
        err_message: '错误的日期'
    }    
}

function getCurrentTime(){
    var now =  new Date();
    var year =  now.getFullYear();
    var month = now.getMonth() > 9 ? now.getMonth() : '0' + now.getMonth();
    var date =  now.getDate() > 9 ? now.getDate() : '0' + now.getDate();

    return parseInt('' + year + month + date, 10);
} 

function IdCard(id_card) {
    this.id_card = id_card;
    this.gender = 'male';
    this.err = null;
}

IdCard.prototype.isInvalid = function() {
    var normal_length = 18
    if(!this.id_card) {
        this.err =  errInfo['empty'];
        return true;
    } 
    if(this.id_card.length > normal_length) {
        this.err =  errInfo['too_long'];    
        return true
    }
    if(this.id_card.length < normal_length) {
        this.err =  errInfo['too_short'];    
        return true        
    }

    if(!moment(this.getBirthday()).isValid()){
        this.err =  errInfo['err_birthday'];    
        return true    
    }

    var now = moment().format('YYYYMMDD');
    if(moment(this.getBirthday()).isAfter(now)) {
        this.err =  errInfo['not_born'];    
        return true    
    }

    if(!/^\d{17}([0-9Xx])$/.test(this.id_card)) {
        this.err =  errInfo['err_format'];    
        return true    
    }

    if (!this.getProvince()) {
        this.err =  errInfo['invalid_place'];    
        return true    
    }
        
    // TODO verify place and tail
    return false
};

IdCard.prototype.getError = function() {
    return this.err;
};

IdCard.prototype.getAge = function() {
    return new Date().getFullYear()  - this.getYear()
};

IdCard.prototype.getBirthday = function() {
    return this.id_card.substr(6,8)
};

IdCard.prototype.getYear = function() {
    return Number(this.id_card.substr(6,4))
};

IdCard.prototype.getMonth = function() {
    return Number(this.id_card.substr(10,2))
};

IdCard.prototype.getDate = function() {
    return Number(this.id_card.substr(12,2))
};

IdCard.prototype.isAfter00 = function () {
    return this.getYear() >= 2000
};

IdCard.prototype.is90 = function() {
    return this.getYear()  < 2000 && this.getYear() >= 1990
};

IdCard.prototype.is80 = function() {
    return this.getYear()  < 1990 && this.getYear() >= 1980
};

IdCard.prototype.is70 = function() {
    return this.getYear()  < 1980 && this.getYear() >= 1970
};

IdCard.prototype.is60 = function() {
    return this.getYear()  < 1970 && this.getYear() >= 1960
};

IdCard.prototype.isBefore60 = function() {
    return this.getYear()  < 1960
};

IdCard.prototype.getGender = function () {
    var genderNum =  this.id_card.substr(16,1);
    if(genderNum%2===0) {
        this.gender = 'female';
    }
    return this.gender;
};

IdCard.prototype.isMale = function () {
    return this.getGender() === 'male';
};

IdCard.prototype.isFemale = function () {
    return this.getGender() === 'female';
};


IdCard.prototype.getProvince  = function() {
    return province[this.id_card.slice(0,2)];
}

module.exports = IdCard;
