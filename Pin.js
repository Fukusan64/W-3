module.exports = class Pin {
  constructor(pinNum, deltaT) {
    this.pinNum = pinNum;
    this.deltaD = 0;
    this.d = 0;
    this.targetD = 0;
    this.updateCount = 0;
    this.deltaT = deltaT;
  }

  update() {
    this.d += this.deltaD;
    this.updateCount--;
    if (this.updateCount <= 0) {
      this.d = this.targetD;
      console.log(this.pinNum, this.d);
      return true;
    } else {
      console.log(this.pinNum, this.d);
      return false;
    }
  }

  setTargetD(d, msec) {
    this.targetD = d;
    this.updateCount = (msec * (1000 / this.deltaT));
    this.deltaD = (d - this.d) / this.updateCount;
  }
}
