/// <reference types="vite/client" />

type ColorTuple = [number, number, number, number];

type MakeupState = {
  lips: boolean;
  eyebrow: boolean;
  eyeshadow: boolean;
  lipColor: ColorTuple;
  eyebrowColor: ColorTuple;
  eyeshadowColor: ColorTuple;
};
declare global {
  interface Window {
    makeupState: MakeupState;
  }
}
