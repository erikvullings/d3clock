import { d3clock, sbb, braun, classic, modern } from './index';

const simDateGenerator = () => {
  const speedFactor = 3;
  let simTime = new Date(2018, 0, 1, 15, 15, 15).valueOf();
  let oldTime = new Date().valueOf();
  const dateFn = () => {
    const curTime = new Date().valueOf();
    const delta = speedFactor * (curTime - oldTime);
    oldTime = curTime;
    simTime += delta;
    return simTime;
  };
  return dateFn;
};

document.addEventListener('DOMContentLoaded', () => {
  d3clock({ target: '#sbb', width: 300, face: sbb });
  d3clock({ target: '#braun', width: 300, face: braun });
  d3clock({ target: '#classic', width: 300, face: classic });
  d3clock({ target: '#modern', width: 300, face: modern });
  d3clock({ target: '#sim', width: 300, face: braun, date: simDateGenerator() });
  d3clock({ target: '#tz', width: 300, face: classic, TZOffset: { hours: 8 } });
});
