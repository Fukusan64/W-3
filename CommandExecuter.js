const Pin = require('./Pin');
const Md = require('./MotorDriver');
module.exports = class CommandExecuter{
	constructor(pinMumArray, deltaT) {
    this.pins = pinMumArray.map(e => typeof e === 'number' ? new Pin(e, deltaT) : new Md(e, deltaT));
    this.cmds = [];
    this.execQueue = [];
    this.finish = true;
    setInterval(()=>this.update(), deltaT);
  }
  setCmds(cmds) {
    this.cmds = cmds;
  }
  exec(funcNum) {
    if (!this.finish) return false;
    this.execQueue = [...(this.cmds[funcNum] || [])];
    this.finish = false;
    return true;
  }
  update() {
    if (!this.finish) {
      if (this.pins.filter(p=>!p.finish).map(p=>p.update()).every(e=>e)) {
        const cmd = this.execQueue.shift();
        if (cmd === undefined) {
          this.finish = true;
          return;
        }
        for (let i = 0;i < this.pins.length;i++) {
          if (cmd[`pin${i + 1}`] !== undefined) {
            this.pins[i].setTargetD(cmd[`pin${i + 1}`], cmd.sec);
          }
        }
      }
    }
  }

  stop() {
    console.log('!stop!');
    this.execQueue.unshift({ sec: 0.5, pin1: 0, pin2: 0, pin3: 0, pin4: 0 }, { sec: 0.5, pin1: 0, pin2: 0, pin3: 0, pin4: 0 });
    this.finish = false;
  }
}
