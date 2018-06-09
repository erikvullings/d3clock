import { ClockFaceCreator } from '..';

export type DateFn = () => number;

/** Clock configuration object */
export interface IClockConfig {
  /** Parent element selector, e.g. #clock */
  target: string;
  /** Clock face creator */
  face: ClockFaceCreator;
  /** Clock width */
  width?: number;
  /** Fix the date */
  date?: string | number | DateFn;
  /** Time zone offset */
  TZOffset?: {
    hours?: number;
    mins?: number;
    secs?: number;
  };
}
