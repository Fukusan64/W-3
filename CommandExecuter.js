const Pin = require('./Pin');
const Md = require('./MotorDriver');
module.exports = class CommandExecuter{
	constructor(deltaT) {
    this.pins = [];
    this.cmds = [];
    this.execQueue = [];
    this.finish = true;
    this.deltaT = deltaT;
    setInterval(()=>this.update(), deltaT);
  }
  setCmds(cmds) {
    this.cmds = cmds;
  }
  setPins(pinNumArray) {
    this.pins = pinNumArray.map(
      e => typeof e === 'number' ? new Pin(e, this.deltaT) : new Md(e, this.deltaT)
    );
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
    this.execQueue = [];
    this.cmds = [];
    this.pins.map(e => e.stop());
    this.finish = false;
  }
}
