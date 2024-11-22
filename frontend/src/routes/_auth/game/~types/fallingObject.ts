export type FallingObject = {
  // map(arg0: (obj: FallingObject) => { y: number; id: number; color: string; x: number; isHidden: boolean; }): unknown;
  id: number;
  color: string;
  x: number;
  y: number;
  isHidden: boolean;
  topHeight: number;
  bottomHeight: number;
  speed: number
};

export type FloatingNumbers = {
  x: number;
  y: number;
  value: number;
  id: number;
  yOffset: number;
  alpha: number;
}
