const { Gpio } = require('pigpio');

module.exports = class MotorDriver {
  constructor([plusPin, minusPin], deltaT) {
    this.plusPin = new Gpio(plusPin, {mode: Gpio.OUTPUT});
    this.minusPin = new Gpio(minusPin, {mode: Gpio.OUTPUT});
    this.plusPinNum = plusPin;
    this.minusPinNum = minusPin;
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
        console.log(this.minusPinNum, Math.round(Math.abs(this.d)));
        this.minusPin.pwmWrite(Math.round(Math.abs(this.d)));
        console.log(this.plusPinNum, 0);
        this.plusPin.pwmWrite(0);
      } else {
        console.log(this.minusPinNum, 0);
        this.minusPin.pwmWrite(0);
        console.log(this.plusPinNum, Math.round(Math.abs(this.d)));
        this.plusPin.pwmWrite(Math.round(Math.abs(this.d)));
      }
      console.groupEnd();
      this.finish = true;
      return true;
    } else {
      console.group(`d=${this.d}`);
      if (this.d < 0) {
        const val = Math.round(Math.abs(this.d));
        console.log(this.minusPinNum, val);
        this.minusPin.pwmWrite(val);
        console.log(this.plusPinNum, 0);
        this.plusPin.pwmWrite(0);
      } else {
        const val = Math.round(Math.abs(this.d));
        console.log(this.minusPinNum, 0);
        this.minusPin.pwmWrite(0);
        console.log(this.plusPinNum, val);
        this.plusPin.pwmWrite(val);
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
    console.log(this.minusPinNum, 0);
    this.minusPin.pwmWrite(0);
    console.log(this.plusPinNum, 0);
    this.plusPin.pwmWrite(0);
  }
}
