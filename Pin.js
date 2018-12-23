module.exports = class Pin {
  constructor(pinNum, deltaT) {
    this.pinNum = pinNum;
    this.deltaD = 0;
    this.d = 0;
    this.targetD = 0;
    this.updateCount = 0;
    this.deltaT = deltaT;
    this.finish = true;
  }

  update() {
    this.d += this.deltaD;
    this.updateCount--;
    if (this.updateCount <= 0) {
      this.d = this.targetD;
      console.log(this.pinNum, Math.round(this.d));
      this.finish = true;
      return true;
    } else {
      console.log(this.pinNum, Math.round(this.d));
      this.finish = false;
      return false;
    }
  }

  setTargetD(d, sec) {
    this.finish = false;
    this.targetD = d;
    this.updateCount = (sec * (1000 / this.deltaT));
    this.deltaD = (d - this.d) / this.updateCount;
  }

  stop() {
    this.finish = true;
    this.targetD = 0;
    this.updateCount = 0;
    this.deltaD = 0;
    this.d = 0;
    console.log(this.pinNum, 0);
  }
}
