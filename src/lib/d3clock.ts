import { range } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { select, Selection, BaseType } from 'd3-selection';
import { easeCircle, easeExp, easeLinear } from 'd3-ease';
import 'd3-transition';
import { IClockConfig, IClockData, IClockFace } from '..';

export const d3clock = (configuration?: IClockConfig) => {
  const config = Object.assign(
    {
      face: 'sbb',
    },
    configuration,
  );

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

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  const faces: { [key: string]: IClockFace } = {
    sbb: {
      outerRing: { r: outerRadius * 1.05, stroke: 'black', strokeWidth: 2 },
      secondsRing: { r: 0, fill: '' },
      secondsInnermostRing: { r: 0, fill: '' },
      tickUnit: (outerRadius * 0.0625) / 3,
      tickWidth: (i: number) => (i % 5 ? faceObj.tickUnit : faceObj.tickUnit * 3),
      tickHeight: (i: number) => (i % 5 ? faceObj.tickUnit * 3 : faceObj.tickUnit * 9),
      tickFill: () => 'black',
      rotationTranslate: (i: number) => `translate(${-faceObj.tickWidth(i) / 2},0)`,
      clockHandx: (d) => {
        if (d.unit === 'hours') {
          return (-faceObj.tickUnit * 6) / 2;
        } else if (d.unit === 'minutes') {
          return (-faceObj.tickUnit * 4.5) / 2;
        } else if (d.unit === 'seconds') {
          return -faceObj.tickUnit / 2;
        }
      },
      clockHandy: (d) => {
        if (d.unit === 'hours') {
          return -outerRadius + faceObj.tickUnit * 9 + faceObj.tickUnit * 4;
        } else if (d.unit === 'minutes') {
          return -outerRadius + faceObj.tickUnit * 3;
        } else if (d.unit === 'seconds') {
          return -outerRadius + faceObj.tickUnit * 9 + faceObj.tickUnit * 4;
        }
      },
      clockHandWidth: (d) => {
        if (d.unit === 'hours') {
          return faceObj.tickUnit * 6;
        } else if (d.unit === 'minutes') {
          return faceObj.tickUnit * 4.5;
        } else if (d.unit === 'seconds') {
          return faceObj.tickUnit;
        }
      },
      clockHandFill: (d) => (d.unit === 'seconds' ? '#e00' : '#333'),
      clockHandHeight: (d) => {
        if (d.unit === 'hours') {
          return (outerRadius - faceObj.tickUnit * 9) * 1.2;
        } else if (d.unit === 'minutes') {
          return outerRadius * 1.2;
        } else if (d.unit === 'seconds') {
          return (outerRadius - faceObj.tickUnit * 9) * 1.2;
        }
      },
      clockHandAdditional: (clockHand: Selection<BaseType, IClockData, BaseType, {}>) => {
        clockHand
          .append('svg:circle')
          .attr('r', (d) => (d.unit === 'seconds' ? faceObj.tickUnit * 4 : 0))
          .attr('cy', (d) => -outerRadius + faceObj.tickUnit * 13)
          .attr('fill', '#e00');
      },
      clockGroupAdditional: () => true,
      easing: easeLinear,
    },
    modern: {
      outerRing: { r: outerRadius, stroke: '#999', strokeWidth: 1 },
      secondsRing: { r: outerRadius * 0.05, fill: 'black' },
      secondsInnermostRing: { r: (outerRadius * 0.05) / 2, fill: 'black' },
      tickUnit: (outerRadius * 0.0625) / 3,
      tickWidth: (i: number) => (i % 5 ? 0 : faceObj.tickUnit),
      tickHeight: (i: number) => (i % 5 ? faceObj.tickUnit : faceObj.tickUnit * 6),
      tickFill: () => 'black',
      rotationTranslate: (i: number) => `translate(${-faceObj.tickWidth(i) / 2},0)`,
      clockHandWidth: (d) => {
        if (d.unit === 'hours') {
          return faceObj.tickUnit * 3;
        } else if (d.unit === 'minutes') {
          return faceObj.tickUnit * 2;
        } else if (d.unit === 'seconds') {
          return faceObj.tickUnit;
        }
      },
      clockHandHeight: (d) => {
        if (d.unit === 'hours') {
          return outerRadius - outerRadius / 3 - faceObj.secondsRing.r * 3;
        } else if (d.unit === 'minutes') {
          return outerRadius - (faceObj.secondsRing.r * 3 + faceObj.tickUnit * 4);
        } else if (d.unit === 'seconds') {
          return outerRadius - (faceObj.secondsRing.r * 3 + faceObj.tickUnit * 4);
        }
      },
      clockHandx: (d) => {
        if (d.unit === 'hours') {
          return (-faceObj.tickUnit * 3) / 2;
        } else if (d.unit === 'minutes') {
          return (-faceObj.tickUnit * 2) / 2;
        } else if (d.unit === 'seconds') {
          return -faceObj.tickUnit / 2;
        }
      },
      clockHandy: (d) => {
        if (d.unit === 'hours') {
          return -outerRadius + outerRadius / 3 + faceObj.secondsRing.r * 3;
        } else if (d.unit === 'minutes') {
          return -outerRadius + faceObj.secondsRing.r * 3 + faceObj.tickUnit * 4;
        } else if (d.unit === 'seconds') {
          return -outerRadius + faceObj.secondsRing.r * 2 + faceObj.tickUnit * 4;
        }
      },
      clockHandFill: (d) => (d.unit === 'seconds' ? 'red' : '#333'),
      clockHandAdditional: () => true,
      clockGroupAdditional: () => true,
      easing: easeExp,
    },
    braun: {
      outerRing: { r: outerRadius * 1.02, stroke: '#999', strokeWidth: 1 },
      secondsRing: { r: outerRadius * 0.04, fill: '#F6C52E' },
      secondsInnermostRing: { r: outerRadius * 0.01, fill: 'black' },
      tickUnit: (outerRadius * 0.0625) / 3,
      tickWidth: (i: number) => (i % 5 ? faceObj.tickUnit / 3 : faceObj.tickUnit),
      tickHeight: (i: number) => (i % 5 ? faceObj.tickUnit * 4.5 : faceObj.tickUnit * 4.5),
      tickFill: (i: number) => (i % 5 ? '#999' : 'black'),
      tickText: {
        fontSize: (width * 14) / 500,
        fontFamily: 'Helvetica, Arial, sans-serif',
        fn: (i) => (i % 5 ? '' : i / 5 > 0 ? '' + i / 5 : '' + 12),
      },
      rotationTranslate: (i: number) => `translate(${-faceObj.tickWidth(i) / 2},0)`,
      clockHandWidth: (d) => {
        if (d.unit === 'hours') {
          return faceObj.tickUnit * 3;
        } else if (d.unit === 'minutes') {
          return faceObj.tickUnit * 2;
        } else if (d.unit === 'seconds') {
          return faceObj.tickUnit;
        }
      },
      clockHandHeight: (d) => {
        if (d.unit === 'hours') {
          return outerRadius - outerRadius / 3 - faceObj.secondsRing.r * 3;
        } else if (d.unit === 'minutes') {
          return outerRadius - (faceObj.secondsRing.r * 3 + faceObj.tickUnit * 4);
        } else if (d.unit === 'seconds') {
          return outerRadius - faceObj.tickUnit * 4;
        }
      },
      clockHandx: (d) => {
        if (d.unit === 'hours') {
          return (-faceObj.tickUnit * 3) / 2;
        } else if (d.unit === 'minutes') {
          return (-faceObj.tickUnit * 2) / 2;
        } else if (d.unit === 'seconds') {
          return -faceObj.tickUnit / 2;
        }
      },
      clockHandy: (d) => {
        if (d.unit === 'hours') {
          return -outerRadius + outerRadius / 3 + faceObj.secondsRing.r * 3;
        } else if (d.unit === 'minutes') {
          return -outerRadius + faceObj.secondsRing.r * 3 + faceObj.tickUnit * 4;
        } else if (d.unit === 'seconds') {
          return -outerRadius + faceObj.secondsRing.r * 3 + faceObj.tickUnit * 4;
        }
      },
      clockHandFill: (d) => {
        if (d.unit === 'seconds') {
          return '#F6C52E';
        } else if (d.unit === 'minutes') {
          return '#333';
        } else {
          return '#666';
        }
      },
      clockHandAdditional: () => true,
      clockGroupAdditional: () => true,
      easing: easeCircle,
    },
    classic: {
      outerRing: { r: outerRadius * 1, stroke: '#000', strokeWidth: 1 },
      secondsRing: { r: outerRadius * 0.04, fill: 'black' },
      secondsInnermostRing: { r: outerRadius * 0.01, fill: 'black' },
      tickUnit: (outerRadius * 0.0625) / 3,
      tickWidth: (i: number) => (i % 5 ? faceObj.tickUnit / 3 : faceObj.tickUnit * 3),
      tickHeight: (i: number) => faceObj.tickUnit * 4.5,
      tickFill: (i: number) => (i % 5 ? '#999' : 'black'),
      tickTextRotated: {
        fontSize: (width * 14) / 500,
        fontFamily: 'Georgia, serif',
        fn: (i) => (i % 5 ? '' : i / 5 > 0 ? romanNumerals[i / 5 - 1] : romanNumerals[12 - 1]),
      },
      tickTextX: (i) =>
        faceObj.tickTextRotated.fn(i).length > 1
          ? -faceObj.tickTextRotated.fontSize +
            (1.5 * faceObj.tickTextRotated.fontSize) / faceObj.tickTextRotated.fn(i).length
          : 0,
      rotationTranslate: (i: number) => `translate(${-faceObj.tickWidth(i) / 2},0)`,
      clockHandWidth: (d) => {
        if (d.unit === 'hours') {
          return faceObj.tickUnit * 2;
        } else if (d.unit === 'minutes') {
          return faceObj.tickUnit * 2;
        } else if (d.unit === 'seconds') {
          return faceObj.tickUnit / 2;
        }
      },
      clockHandHeight: (d) => {
        if (d.unit === 'hours') {
          return outerRadius - outerRadius / 3 - faceObj.secondsRing.r * 3;
        } else if (d.unit === 'minutes') {
          return outerRadius - (faceObj.secondsRing.r * 3 + faceObj.tickUnit * 4);
        } else if (d.unit === 'seconds') {
          return outerRadius - faceObj.tickUnit * 4;
        }
      },
      clockHandx: (d) => {
        if (d.unit === 'hours') {
          return (-faceObj.tickUnit * 3) / 2;
        } else if (d.unit === 'minutes') {
          return (-faceObj.tickUnit * 2) / 2;
        } else if (d.unit === 'seconds') {
          return -faceObj.tickUnit / 2;
        }
      },
      clockHandy: (d) => {
        if (d.unit === 'hours') {
          return -outerRadius + outerRadius / 3 + faceObj.secondsRing.r * 3;
        } else if (d.unit === 'minutes') {
          return -outerRadius + faceObj.secondsRing.r * 3 + faceObj.tickUnit * 4;
        } else if (d.unit === 'seconds') {
          return -outerRadius + faceObj.secondsRing.r * 3 + faceObj.tickUnit * 4;
        }
      },
      clockHandFill: (d) => {
        if (d.unit === 'seconds') {
          return 'black';
        } else if (d.unit === 'minutes') {
          return 'black';
        } else {
          return 'black';
        }
      },
      clockHandAdditional: () => true,
      clockGroupAdditional: () => {
        clockGroup
          .append('svg:circle')
          .attr('r', faceObj.outerRing.r - faceObj.tickUnit * 4)
          .attr('fill', 'none')
          .attr('stroke', '#000')
          .attr('stroke-width', '1px');
        return true;
      },
      easing: easeExp,
    },
  };

  const faceObj = faces[face];

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
    .attr('width', (d, i) => faceObj.tickWidth(i))
    .attr('height', (d, i) => faceObj.tickHeight(i))
    .attr('fill', (d, i) => faceObj.tickFill(i))
    .attr('transform', (d, i) => `rotate(${i * 6}),${faceObj.rotationTranslate(i)}`);

  if (faceObj.tickText) {
    const radian = (i) => 6 * i * (pi / 180) - (90 * pi) / 180;
    tickGroup
      .append('text')
      .attr('class', 'tick')
      .attr('x', (d, i) => {
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
      .attr('y', (d, i) => {
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
      .text((d, i) => faceObj.tickText.fn(i));
  }

  if (faceObj.tickTextRotated) {
    tickGroup
      .append('text')
      .attr('class', 'tick')
      .attr('x', (i) => faceObj.tickTextX(i))
      .attr('y', (i) => -outerRadius + faceObj.tickHeight(i) * 2.5)
      .attr('font-family', faceObj.tickTextRotated.fontFamily)
      .attr('font-size', faceObj.tickTextRotated.fontSize)
      .text((d, i) => faceObj.tickTextRotated.fn(i))
      .attr('transform', (d, i) => `rotate(${i * 6}),${faceObj.rotationTranslate(i)}`);
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
