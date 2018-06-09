import { ClockFaceCreator } from '..';

/** Clock configuration object */
export interface IClockConfig {
  /** Parent element selector, e.g. #clock */
  target: string;
  /** Clock face creator */
  face: ClockFaceCreator;
  /** Clock width */
  width?: number;
  /** Fix the date */
  date?: Date;
  /** Time zone offset */
  TZOffset?: {
    hours?: number;
    mins?: number;
    secs?: number;
  };
}
