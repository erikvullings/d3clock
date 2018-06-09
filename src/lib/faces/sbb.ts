import { easeLinear } from 'd3-ease';
import { BaseType, Selection } from 'd3-selection';
import { IClockData, ClockFaceCreator } from '../..';

export const sbb: ClockFaceCreator = (outerRadius: number, width: number) => {
  const tickUnit = (outerRadius * 0.0625) / 3;
  const tickWidth = (i: number) => (i % 5 ? tickUnit : tickUnit * 3);

  return {
    outerRing: { r: outerRadius * 1.05, stroke: 'black', strokeWidth: 2 },
    secondsRing: { r: 0, fill: '' },
    secondsInnermostRing: { r: 0, fill: '' },
    tickUnit,
    tickWidth,
    tickHeight: (i: number) => (i % 5 ? tickUnit * 3 : tickUnit * 9),
    tickFill: () => 'black',
    rotationTranslate: (i: number) => `translate(${-tickWidth(i) / 2},0)`,
    clockHandx: (d) => {
      if (d.unit === 'hours') {
        return (-tickUnit * 6) / 2;
      } else if (d.unit === 'minutes') {
        return (-tickUnit * 4.5) / 2;
      } else {
        return -tickUnit / 2;
      }
    },
    clockHandy: (d) => {
      if (d.unit === 'hours') {
        return -outerRadius + tickUnit * 9 + tickUnit * 4;
      } else if (d.unit === 'minutes') {
        return -outerRadius + tickUnit * 3;
      } else {
        return -outerRadius + tickUnit * 9 + tickUnit * 4;
      }
    },
    clockHandWidth: (d) => {
      if (d.unit === 'hours') {
        return tickUnit * 6;
      } else if (d.unit === 'minutes') {
        return tickUnit * 4.5;
      } else {
        return tickUnit;
      }
    },
    clockHandFill: (d) => (d.unit === 'seconds' ? '#e00' : '#333'),
    clockHandHeight: (d) => {
      if (d.unit === 'hours') {
        return (outerRadius - tickUnit * 9) * 1.2;
      } else if (d.unit === 'minutes') {
        return outerRadius * 1.2;
      } else {
        return (outerRadius - tickUnit * 9) * 1.2;
      }
    },
    clockHandAdditional: (clockHand: Selection<BaseType, IClockData, BaseType, {}>) => {
      clockHand
        .append('svg:circle')
        .attr('r', (d) => (d.unit === 'seconds' ? tickUnit * 4 : 0))
        .attr('cy', (_d) => -outerRadius + tickUnit * 13)
        .attr('fill', '#e00');
    },
    clockGroupAdditional: () => true,
    easing: easeLinear,
  };
};
