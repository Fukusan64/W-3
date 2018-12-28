const integerTest = str => /^-?[0-9]+$/.test(str);
const positiveNumberTest = str => /^([1-9]\d*|0)(\.\d+)?$/.test(str);
const pinTest = str => /^pin[1-9]$/.test(str);
const naturalNumberTest = str => /^[0-9]+$/.test(str);

module.exports = text => {
  let [pinText, codeText] = text.replace(/\/\/[^\n]+/g,'').split(/(?<=#[^\n]+)\n/);
  if (!codeText) {
    codeText = pinText;
    pinText = '';
  }
  console.log([pinText, codeText]);
  const cmdArr = [];
  const pinMap = [];
  pinText
    .replace('#', '')
    .split(',')
    .filter(e => e !== '')
    .map(e => e.split('='))
    .forEach((e) => {
      const [pin, num] = e.map(e => e.trim());
      if (!pinTest(pin)) throw `pinTest error (set pin): ${pin}`;
      const pinNum = Number(pin.replace('pin', '')) - 3;
      if (pinNum < 0) throw `pinNum error "smaller than 3": ${pin}`;

      if (!naturalNumberTest(num)) throw `naturalNumberTest error (set pin): ${num}`;
      pinMap[pinNum] = Number(num);
    });
  codeText
    .trim()
    .replace(/\n+/g,'\n')
    .split(/@/)
    .filter(e => e !== '')
    .forEach(e => {
      const bid = e.match(/button([0-9])/);
      cmdArr[Number(bid[1])] = e;
    })
  ;
  const tasks = cmdArr
    .map(e => typeof e === 'string' ? e : '')
    .map(e => {
      return e.replace(/button[0-9]/, '').trim().split('\n').map(e => {
        const [pinData, sec] = e.split(':');
        if (!positiveNumberTest(sec.trim())) {
          throw `positiveNumberTest error (sec): ${sec}`;
        }
        const data = {sec: Number(sec)};
        pinData.split(',').map(e => e.split('=')).forEach(e => {
          const pin = e[0].trim();
          if (!pinTest(pin)) {
            throw `pinNameTest error (pinName): ${pin}`;
          }
          if (!integerTest(e[1].trim())) {
            throw `integerTest error (targetVal): ${e[1].trim()}`;
          }
          data[e[0].trim()] = Number(e[1]);
        });
        return data;
      });
    })
  ;
  return [pinMap, tasks];
};
