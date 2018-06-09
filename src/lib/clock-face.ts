import { IClockData } from './clock-data';
import { BaseType, Selection } from 'd3-selection';

export interface ITickText {
  fontSize: number;
  fontFamily: string;
  fn: (i: number) => string;
}

export type ClockFaceCreator = (outerRadius: number, width: number) => IClockFace;

export interface IClockFace {
  outerRing: {
    r: number;
    stroke: string;
    strokeWidth: number;
  };
  secondsRing: {
    r: number;
    fill: string;
  };
  secondsInnermostRing: {
    r: number;
    fill: string;
  };
  tickText?: ITickText;
  tickTextX?: (i: number) => number;
  tickTextRotated?: ITickText;
  tickUnit: number;
  tickWidth: (i: number) => number;
  tickHeight: (i: number) => number;
  tickFill: (i?: number) => string;
  rotationTranslate: (i: number) => string;
  clockHandx: (d: IClockData) => number;
  clockHandy: (d: IClockData) => number;
  clockHandWidth: (d: IClockData) => number;
  clockHandFill: (d: IClockData) => string;
  clockHandHeight: (d: IClockData) => number;
  clockHandAdditional: (clockHand: Selection<BaseType, IClockData, BaseType, {}>) => void;
  clockGroupAdditional: (clockGroup?: Selection<BaseType, {}, HTMLElement, any>) => boolean;
  easing: (normalizedTime: number) => number;
}
