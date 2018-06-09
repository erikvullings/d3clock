import { ITickText } from './../clock-face';
import { easeExp } from 'd3-ease';
import { BaseType, Selection } from 'd3-selection';
import { ClockFaceCreator } from '../..';

export const classic: ClockFaceCreator = (outerRadius: number, width: number) => {
  const tickUnit = (outerRadius * 0.0625) / 3;
  const tickWidth = (i: number) => (i % 5 ? tickUnit / 3 : tickUnit * 3);
  const tickTextRotated: ITickText = {
    fontSize: (width * 14) / 500,
    fontFamily: 'Georgia, serif',
    fn: (i) => (i % 5 ? '' : i / 5 > 0 ? romanNumerals[i / 5 - 1] : romanNumerals[12 - 1]),
  };
  const outerRing = { r: outerRadius * 1, stroke: '#000', strokeWidth: 1 };
  const secondsRing = { r: outerRadius * 0.04, fill: 'black' };
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  return {
    outerRing,
    secondsRing,
    secondsInnermostRing: { r: outerRadius * 0.01, fill: 'black' },
    tickUnit,
    tickWidth,
    tickHeight: (_i: number) => tickUnit * 4.5,
    tickFill: (i?: number) => (i && i % 5 ? '#999' : 'black'),
    tickTextRotated,
    tickTextX: (i) =>
      tickTextRotated.fn(i).length > 1
        ? -tickTextRotated.fontSize + (1.5 * tickTextRotated.fontSize) / tickTextRotated.fn(i).length
        : 0,
    rotationTranslate: (i: number) => `translate(${-tickWidth(i) / 2},0)`,
    clockHandWidth: (d) => {
      if (d.unit === 'hours') {
        return tickUnit * 2;
      } else if (d.unit === 'minutes') {
        return tickUnit * 2;
      } else {
        return tickUnit / 2;
      }
    },
    clockHandHeight: (d) => {
      if (d.unit === 'hours') {
        return outerRadius - outerRadius / 3 - secondsRing.r * 3;
      } else if (d.unit === 'minutes') {
        return outerRadius - (secondsRing.r * 3 + tickUnit * 4);
      } else {
        return outerRadius - tickUnit * 4;
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
        return -outerRadius + secondsRing.r * 3 + tickUnit * 4;
      }
    },
    clockHandFill: (d) => 'black',
    clockHandAdditional: () => true,
    clockGroupAdditional: (clockGroup?: Selection<BaseType, {}, HTMLElement, any>) => {
      if (clockGroup) {
        clockGroup
          .append('svg:circle')
          .attr('r', outerRing.r - tickUnit * 4)
          .attr('fill', 'none')
          .attr('stroke', '#000')
          .attr('stroke-width', '1px');
      }
      return true;
    },
    easing: easeExp,
  };
};
