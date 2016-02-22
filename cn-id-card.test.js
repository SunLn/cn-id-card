var IdCard = require('./cn-id-card')
var chai = require('chai');

chai.should();

describe('check id card', function() {
  describe('check wheter valid', function() {

    it('empty error check should be work well', function() {
        var user = new IdCard('');
        user.isInvalid().should.be.equal(true);
        user.getError().should.have.property('err_code').equal(4000)
        user.getError().should.have.property('err_message').equal('空身份证')
    });

    it('length error check should be work well', function() {
        var user = new IdCard('110000198104190931X');
        user.isInvalid().should.be.equal(true);
        user.getError().should.have.property('err_code').equal(4001)
        user.getError().should.have.property('err_message').equal('身份证长度过长')

        var user2 = new IdCard('11000019810419093');
        user2.isInvalid().should.be.equal(true);
        user2.getError().should.have.property('err_code').equal(4002)
        user2.getError().should.have.property('err_message').equal('身份证长度过短')       
    });

    describe('birthdy check', function() {
        it('birthdy check: invalid month ', function() {
            var user = new IdCard('12000020031331093X');
            user.isInvalid().should.be.equal(true);
            user.getError().should.not.be.equal(null);   
            user.getError().should.have.property('err_code').equal(4007)
            user.getError().should.have.property('err_message').equal('错误的日期') 

            user = new IdCard('12000020030031093X');
            user.isInvalid().should.be.equal(true);
        });
        it('birthdy check: invalid date ', function() {    
            user = new IdCard('12000020030231093X');
            user.isInvalid().should.be.equal(true); 
            user.getError().should.have.property('err_code').equal(4007)
            user.getError().should.have.property('err_message').equal('错误的日期') 

            user = new IdCard('12000020030133093X');
            user.isInvalid().should.be.equal(true);
        });
        it('birthdy check: born after today ', function() {    
            user = new IdCard('11000020810419093X');
            user.isInvalid().should.be.equal(true);
            user.getError().should.not.be.equal(null);   
            user.getError().should.have.property('err_code').equal(4003)
            user.getError().should.have.property('err_message').equal('出生日期大于当前日期') 
        });   
    });    

    it('error format check should be work well', function() {
        var user = new IdCard('11000019810419093S');
        user.isInvalid().should.be.equal(true);
        user.getError().should.not.be.equal(null);   
        user.getError().should.have.property('err_code').equal(4006)
        user.getError().should.have.property('err_message').equal('身份证格式不正确') 

        user = new IdCard('1a000019810419093X');
        user.isInvalid().should.be.equal(true);

        user = new IdCard('b10000198104190934');
        user.isInvalid().should.be.equal(true);

        user = new IdCard('B10000198104190934');
        user.isInvalid().should.be.equal(true);
    });  

    it('right format check ', function() {
        var user = new IdCard('11000019810419093X');
        user.isInvalid().should.be.equal(false);
        (user.getError() === null).should.be.true;

        user = new IdCard('11000019810419093x');
        user.isInvalid().should.be.equal(false);
        (user.getError() === null).should.be.true;

        user = new IdCard('110000198104190933');
        user.isInvalid().should.be.equal(false);
        (user.getError() === null).should.be.true;

        user = new IdCard('210000198104190933');
        user.isInvalid().should.be.equal(false);
        (user.getError() === null).should.be.true;
    }); 



  });   

  describe('check time related ', function() {
    var user = null, user2 = null;

    before(function() {
        user = new IdCard('11000019810419093X');
        user2 = new IdCard('11000020011009093X');
    });

    it('getYear should be work well', function() {
        user.getYear().should.be.equal(1981);
        user.getYear().should.not.be.equal('1981');
        user.getYear().should.not.be.equal(1982);
    });

    it('getMonth should be work well', function() {
        user.getMonth().should.be.equal(4);
        user2.getMonth().should.be.equal(10);

        user.getMonth().should.not.be.equal('04');
        user2.getMonth().should.not.be.equal('10');
    });

    it('getDate should be work well', function() {
        user.getDate().should.be.equal(19);
        user.getDate().should.not.be.equal('19');
        user2.getDate().should.be.equal(9);
        user2.getDate().should.not.be.equal('09');
    });
    
    it('getAge should be work well', function() {
        var year = new Date().getFullYear();
        user.getAge().should.be.equal(year - 1981);
        user2.getAge().should.be.equal(year - 2001);
    });

  });

  describe('check gender related ', function() {
    var user = null, user2 = null;

    before(function() {
        user = new IdCard('110000198104190932');
        user2 = new IdCard('110000200110090922');
    });

    it('getGender should be work well', function() {
        user.getGender().should.be.equal('male');
        user2.getGender().should.be.equal('female');
    });

    it('isMale should be work well', function() {
        user.isMale().should.be.equal(true);
        user2.isMale().should.be.equal(false);
    });

    it('isFemale should be work well', function() {
        user.isFemale().should.be.equal(false);
        user2.isFemale().should.be.equal(true);
    });
    
  }); 
});