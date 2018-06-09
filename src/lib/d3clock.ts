import { range } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { select } from 'd3-selection';
import 'd3-transition'; // Load the transitions, add to selection
import { IClockConfig, IClockData, IClockFace } from '..';
import { sbb } from './faces/sbb';
import { modern } from './faces/modern';
import { braun } from './faces/braun';
import { classic } from './faces/classic';

export const d3clock = (config: IClockConfig) => {
  const pi = Math.PI;
  const formatSecond = timeFormat('%S');
  const formatMinute = timeFormat('%M');
  const formatHour = timeFormat('%H');
  const width = config.width || 1000;
  const height = width / 2;

  const outerRadius = (0.8 * height) / 2;
  const offSetX = height / 2;
  const offSetY = height / 2;

  const fields = (date?: Date | string | number) => {
    const d = date ? new Date(date) : new Date();
    const second = d.getSeconds() + secOffset;
    const minute = d.getMinutes() + minOffset;
    const hour = d.getHours() + hourOffset + minute / 60;
    return [
      {
        unit: 'hours',
        text: formatHour(d),
        numeric: hour,
      },
      {
        unit: 'minutes',
        text: formatMinute(d),
        numeric: minute,
      },
      {
        unit: 'seconds',
        text: formatSecond(d),
        numeric: second,
      },
    ] as IClockData[];
  };

  const hourOffset = config.TZOffset && config.TZOffset.hours ? config.TZOffset.hours : 0;
  const minOffset = config.TZOffset && config.TZOffset.mins ? config.TZOffset.mins : 0;
  const secOffset = config.TZOffset && config.TZOffset.secs ? config.TZOffset.secs : 0;

  const face = config.face;

  const faces: { [key: string]: IClockFace } = {
    sbb: sbb(outerRadius, width),
    modern: modern(outerRadius, width),
    braun: braun(outerRadius, width),
    classic: classic(outerRadius, width),
  };

  const faceObj = face(outerRadius, width);

  // create the basic visualization:
  const vis = select(config.target)
    .append('svg:svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'clock');

  const clockGroup = vis.append('svg:g').attr('transform', `translate(${offSetX},${offSetY})`);

  // create the outer circle of the clock face
  clockGroup
    .append('svg:circle')
    .attr('r', faceObj.outerRing.r)
    .attr('fill', 'none')
    .attr('class', 'clock outercircle')
    .attr('stroke', faceObj.outerRing.stroke)
    .attr('stroke-width', faceObj.outerRing.strokeWidth);

  faceObj.clockGroupAdditional(clockGroup);

  // create the minutes and hours ticks
  const tickGroup = clockGroup
    .append('svg:g')
    .selectAll('.tick')
    .data(range(60))
    .enter();

  tickGroup
    .append('svg:rect')
    .attr('class', 'tick')
    .attr('x', 0)
    .attr('y', -outerRadius)
    // .attr("width", function(d, i){return (i%5) ? 0 : 1;})
    .attr('width', (_d, i) => faceObj.tickWidth(i))
    .attr('height', (_d, i) => faceObj.tickHeight(i))
    .attr('fill', (_d, i) => faceObj.tickFill(i))
    .attr('transform', (_d, i) => `rotate(${i * 6}),${faceObj.rotationTranslate(i)}`);

  if (faceObj.tickText) {
    const radian = (i) => 6 * i * (pi / 180) - (90 * pi) / 180;
    tickGroup
      .append('text')
      .attr('class', 'tick')
      .attr('x', (_d, i) => {
        const xPos = Math.cos(radian(i));
        const pos = Math.round(100 * xPos); // >0, <0, 0
        if (pos > 0) {
          return (outerRadius - faceObj.tickHeight(i) - faceObj.tickText.fontSize) * xPos;
        } else if (pos < 0) {
          return (outerRadius - faceObj.tickText.fontSize / 1.2) * xPos;
        } else {
          return (
            (-faceObj.tickText.fontSize * ('' + faceObj.tickText.fn(i)).length) / 2 +
            (('' + faceObj.tickText.fn(i)).length * faceObj.tickText.fontSize) / 5
          );
        }
      })
      .attr('y', (_d, i) => {
        const yPos = Math.sin(radian(i));
        const pos = Math.round(100 * yPos);
        if (pos > 0) {
          return (outerRadius - faceObj.tickText.fontSize) * yPos;
        } else if (pos < 0) {
          return (outerRadius - faceObj.tickHeight(i) - faceObj.tickText.fontSize) * yPos;
        } else {
          return faceObj.tickText.fontSize / 3;
        }
      })

      .attr('font-family', faceObj.tickText.fontFamily)
      .attr('font-size', faceObj.tickText.fontSize)
      .text((_d, i) => faceObj.tickText.fn(i));
  }

  if (faceObj.tickTextRotated) {
    tickGroup
      .append('text')
      .attr('class', 'tick')
      .attr('x', (i) => faceObj.tickTextX(i))
      .attr('y', (i) => -outerRadius + faceObj.tickHeight(i) * 2.5)
      .attr('font-family', faceObj.tickTextRotated.fontFamily)
      .attr('font-size', faceObj.tickTextRotated.fontSize)
      .text((_d, i) => faceObj.tickTextRotated.fn(i))
      .attr('transform', (_d, i) => `rotate(${i * 6}),${faceObj.rotationTranslate(i)}`);
  }

  let drawClockHandAdditional = false;

  // render / update the clock hands
  const render = (data: IClockData[]) => {
    const clockHand = clockGroup.selectAll('.clockhand').data(data);
    const firstTime = clockHand.nodes().length === 0;
    if (firstTime) {
      clockHand
        .enter()
        .append('svg:g')
        .attr('class', (d) => 'clockhand ' + d.unit)
        .append('svg:rect')
        .attr('x', (d) => faceObj.clockHandx(d))
        .attr('y', (d) => faceObj.clockHandy(d))
        .attr('width', (d) => faceObj.clockHandWidth(d))
        .attr('fill', (d) => faceObj.clockHandFill(d))
        .attr('height', (d) => faceObj.clockHandHeight(d));

      // create the circle of the seconds hand
      clockGroup
        .append('svg:circle')
        .attr('r', faceObj.secondsRing.r)
        .attr('fill', faceObj.secondsRing.fill)
        .attr('class', 'clock innercircle');

      // create the circle of the pin that holds in place the seconds hand
      clockGroup
        .append('svg:circle')
        .attr('r', faceObj.secondsInnermostRing.r)
        .attr('fill', faceObj.secondsInnermostRing.fill)
        .attr('class', 'clock innermostcircle');
    }

    clockHand
      .transition()
      .duration(1000)
      .ease(faceObj.easing)
      .attr('transform', (d) => (d.unit === 'hours' ? `rotate(${(d.numeric % 12) * 30})` : `rotate(${d.numeric * 6})`));

    if (drawClockHandAdditional) {
      drawClockHandAdditional = false;
      faceObj.clockHandAdditional(clockHand);
    }
    if (firstTime) {
      drawClockHandAdditional = true;
      faceObj.clockHandAdditional(clockHand);
    }
  };

  if (config.date) {
    const data = fields(config.date);
    render(data);
  } else {
    setInterval(() => {
      const data = fields();
      return render(data);
    }, 1000);
  }
};
