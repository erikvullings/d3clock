import { easeCircle } from 'd3-ease';
import { ClockFaceCreator } from '../..';

export const braun: ClockFaceCreator = (outerRadius: number, width: number) => {
  const tickUnit = (outerRadius * 0.0625) / 3;
  const tickWidth = (i: number) => (i % 5 ? tickUnit / 3 : tickUnit);
  const secondsRing = { r: outerRadius * 0.04, fill: '#F6C52E' };

  return {
    outerRing: { r: outerRadius * 1.02, stroke: '#999', strokeWidth: 1 },
    secondsRing,
    secondsInnermostRing: { r: outerRadius * 0.01, fill: 'black' },
    tickUnit,
    tickWidth,
    tickHeight: (i: number) => (i % 5 ? tickUnit * 4.5 : tickUnit * 4.5),
    tickFill: (i: number) => (i % 5 ? '#999' : 'black'),
    tickText: {
      fontSize: (width * 14) / 500,
      fontFamily: 'Helvetica, Arial, sans-serif',
      fn: (i) => (i % 5 ? '' : i / 5 > 0 ? '' + i / 5 : '' + 12),
    },
    rotationTranslate: (i: number) => `translate(${-tickWidth(i) / 2},0)`,
    clockHandWidth: (d) => {
      if (d.unit === 'hours') {
        return tickUnit * 3;
      } else if (d.unit === 'minutes') {
        return tickUnit * 2;
      } else if (d.unit === 'seconds') {
        return tickUnit;
      }
    },
    clockHandHeight: (d) => {
      if (d.unit === 'hours') {
        return outerRadius - outerRadius / 3 - secondsRing.r * 3;
      } else if (d.unit === 'minutes') {
        return outerRadius - (secondsRing.r * 3 + tickUnit * 4);
      } else if (d.unit === 'seconds') {
        return outerRadius - tickUnit * 4;
      }
    },
    clockHandx: (d) => {
      if (d.unit === 'hours') {
        return (-tickUnit * 3) / 2;
      } else if (d.unit === 'minutes') {
        return (-tickUnit * 2) / 2;
      } else if (d.unit === 'seconds') {
        return -tickUnit / 2;
      }
    },
    clockHandy: (d) => {
      if (d.unit === 'hours') {
        return -outerRadius + outerRadius / 3 + secondsRing.r * 3;
      } else if (d.unit === 'minutes') {
        return -outerRadius + secondsRing.r * 3 + tickUnit * 4;
      } else if (d.unit === 'seconds') {
        return -outerRadius + secondsRing.r * 3 + tickUnit * 4;
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
  };
};
