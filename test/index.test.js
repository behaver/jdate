const JDate = require('../index');
const expect = require("chai").expect;

describe('#Logic', () => {
  describe('#constructor(d, dtype)', () => {
    it('The param d must be Number or Date, if not throw an error', () => {
      expect(() => { new JDate('123', 'jd') }).to.throw();
      expect(() => { new JDate(['123'], 'jd') }).to.throw();
      expect(() => { new JDate(false, 'jd') }).to.throw();
      expect(() => { new JDate(1223323, 'jd') }).to.not.throw();
      expect(() => { new JDate(new Date, 'date') }).to.not.throw();
      expect(() => { new JDate }).not.throw();
    });
    it('The param dtype must in { "date", "jd", "jde", "j2000", "jdec", "jdet" }, if not throw an error', () => {
      expect(() => { new JDate(112233, 'cc') }).to.throw();
      expect(() => { new JDate(112233, 123) }).to.throw();
      expect(() => { new JDate(112233, false) }).to.throw();
    })
    it('new JDate(11223344) and (new JDate).setJD(11223344) represent the same time.', () => {
      expect((new JDate(11223344)).getJD()).equal((new JDate).setJD(11223344).getJD());
    });
  });
  describe('#getDate()', () => {
    it('getDate() should return a Date Object', () => {
      expect((new JDate(11223344)).getDate()).to.be.a('date');
    });
  });
  describe('#setDate(date)', () => {
    it('When the parem date is not a Date Object, it should throw an error.', () => {
      expect(() => {(new JDate).setDate(123)}).to.throw();
      expect(() => {(new JDate).setDate(new Date('2000/1/1'))}).to.not.throw();
    });
  });
  describe('#getJD()', () => {
    it('getJD() should return a Number.', () => {
      expect((new JDate).getJD()).to.be.a('number');
    });
  });
  describe('#setJD(jd)', () => {
    it('When jd is not a Number, it should throw an error.', () => {
      expect(() => {(new JDate).setJD('123')}).to.throw();
    });
    it('When jd is < 0, it should throw an error.', () => {
      expect(() => {(new JDate).setJD(-123)}).to.throw();
    });
  });
  describe('#getJDE()', () => {
    it('getJDE() should return a Number.', () => {
      expect((new JDate).getJDE()).to.be.a('number');
    });
  });
  describe('#setJDE(jde)', () => {
    it('When jde is not a Number, it should throw an error.', () => {
      expect(() => {(new JDate).setJDE('11223344')}).to.throw();
    });
  });
  describe('#getJ2000()', () => {
    it('getJ2000() should return a Number.', () => {
      expect((new JDate).getJ2000()).to.be.a('number');
    });
  });
  describe('#setJ2000(jde)', () => {
    it('When j2000 is not a Number, it should throw an error.', () => {
      expect(() => {(new JDate).setJ2000('11223344')}).to.throw();
    });
  });
  describe('#getJDEC()', () => {
    it('getJDEC() should return a Number.', () => {
      expect((new JDate).getJDEC()).to.be.a('number');
    });
  });
  describe('#setJDEC(jdec)', () => {
    it('When jdec is not a Number, it should throw an error.', () => {
      expect(() => {(new JDate).setJDEC('11223344')}).to.throw();
    });
  });
  describe('#getJDET()', () => {
    it('getJDET() should return a Number.', () => {
      expect((new JDate).getJDET()).to.be.a('number');
    });
  });
  describe('#setJDET(jdet)', () => {
    it('When jdet is not a Number, it should throw an error.', () => {
      expect(() => {(new JDate).setJDET('11223344')}).to.throw();
    });
  });
  describe('#calcUTDelay(jd)', () => {
    it('calcUTDelay(jd) should return a Number.', () => {
      expect((new JDate).calcUTDelay(2446896.30625)).to.be.a('number');
    });
  });
});

describe('#Verify', () => {
  it('JD 2446896.30625; Date 1987/4/11 03:21:00; JDEC -0.1272743 [天文算法 12.b]', () => {
    let d = new Date('1987/4/11 03:21:00');
    let jdate = new JDate(d, 'date');
    expect(jdate.getJD()).equal(2446896.30625);
    expect(jdate.getJDEC().toFixed(7)).equal('-0.1272743');
  })
});
