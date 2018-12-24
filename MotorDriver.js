module.exports = class MotorDriver {
  constructor([plusPin, minusPin], deltaT) {
    this.plusPin = plusPin;
    this.minusPin = minusPin;
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
      console.group(`d=${this.d}`);
      if (this.d < 0) {
        console.log(this.minusPin, Math.round(Math.abs(this.d)));
        console.log(this.plusPin, 0);
      } else {
        console.log(this.minusPin, 0);
        console.log(this.plusPin, Math.round(Math.abs(this.d)));
      }
      console.groupEnd();
      this.finish = true;
      return true;
    } else {
      console.group(`d=${this.d}`);
      if (this.d < 0) {
        console.log(this.minusPin, Math.round(Math.abs(this.d)));
        console.log(this.plusPin, 0);
      } else {
        console.log(this.minusPin, 0);
        console.log(this.plusPin, Math.round(Math.abs(this.d)));
      }
      console.groupEnd();
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
    console.log(this.minusPin, 0);
    console.log(this.plusPin, 0);
  }
}
