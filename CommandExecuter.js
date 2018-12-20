const Pin = require('./Pin');
module.exports = class CommandExecuter{
	constructor(pinMumArray, deltaT) {
    this.pins = pinMumArray.map(e => new Pin(e, deltaT));
    this.cmds = [];
    this.execQueue = [];
    this.finish = true;
    setInterval(()=>this.update(), deltaT);
  }
  setCmds(cmds) {
    this.cmds = mcds;
  }
  exec(funcNum) {
    if (!this.finish) return false;
    this.execQueue = [...this.cmds[funcNum - 1]];
    this.finish = false;
    return true;
  }
  update() {
    if(!this.finish) {
      //TODO
      if (/*pin update and check finish flag*/) {
        /* set next cmd */
        /* check is finish and set finish flag*/
      }
    }
  }

  stop() {
    this.execQueue.push({ sec: 0, pin1: 0, pin2: 0, pin3: 0, pin4: 0 });
    this.finish = false;
  }
}
