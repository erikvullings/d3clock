import { easeExp } from 'd3-ease';
import { ClockFaceCreator } from '../..';

export const modern: ClockFaceCreator = (outerRadius: number, _width: number) => {
  const tickUnit = (outerRadius * 0.0625) / 3;
  const tickWidth = (i: number) => (i % 5 ? 0 : tickUnit);
  const secondsRing = { r: outerRadius * 0.05, fill: 'black' };

  return {
    outerRing: { r: outerRadius, stroke: '#999', strokeWidth: 1 },
    secondsRing,
    secondsInnermostRing: { r: (outerRadius * 0.05) / 2, fill: 'black' },
    tickUnit,
    tickWidth,
    tickHeight: (i: number) => (i % 5 ? tickUnit : tickUnit * 6),
    tickFill: () => 'black',
    rotationTranslate: (i: number) => `translate(${-tickWidth(i) / 2},0)`,
    clockHandWidth: (d) => {
      if (d.unit === 'hours') {
        return tickUnit * 3;
      } else if (d.unit === 'minutes') {
        return tickUnit * 2;
      } else {
        return tickUnit;
      }
    },
    clockHandHeight: (d) => {
      if (d.unit === 'hours') {
        return outerRadius - outerRadius / 3 - secondsRing.r * 3;
      } else if (d.unit === 'minutes') {
        return outerRadius - (secondsRing.r * 3 + tickUnit * 4);
      } else {
        return outerRadius - (secondsRing.r * 3 + tickUnit * 4);
      }
    },
    clockHandx: (d) => {
      if (d.unit === 'hours') {
        return (-tickUnit * 3) / 2;
      } else if (d.unit === 'minutes') {
        return (-tickUnit * 2) / 2;
      } else {
        return -tickUnit / 2;
      }
    },
    clockHandy: (d) => {
      if (d.unit === 'hours') {
        return -outerRadius + outerRadius / 3 + secondsRing.r * 3;
      } else if (d.unit === 'minutes') {
        return -outerRadius + secondsRing.r * 3 + tickUnit * 4;
      } else {
        return -outerRadius + secondsRing.r * 2 + tickUnit * 4;
      }
    },
    clockHandFill: (d) => (d.unit === 'seconds' ? 'red' : '#333'),
    clockHandAdditional: () => true,
    clockGroupAdditional: () => true,
    easing: easeExp,
  };
};
