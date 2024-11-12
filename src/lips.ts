import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import {
  BLUR_AMOUNT_2,
  COMPOSITE_OPERATION,
  LOWER_LIP_DOT_BLUR_AMOUNT,
  LOWER_LIP_INDICES,
  LOWER_WHITE_LIP_INDICESFSET,
  UPPER_LIP_INDICES,
  UPPER_WHITE_LIP_INDICESFSET,
} from "./indices";

type Color = string;

export async function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let img = new Image();
    img.crossOrigin = "Anynomous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export function applyTextureOnLips(
  faceLandmarks: NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D,
  lipColor: Color,
  lipTextureImageL: HTMLImageElement,
  lipTextureImageU: HTMLImageElement,
  dimension: { height: number; width: number },
  alphaValue: any
) {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = dimension.width;
  tempCanvas.height = dimension.height;
  const tempCtx = tempCanvas.getContext("2d")!;

  drawUpperLip(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    UPPER_LIP_INDICES,
    lipColor,
    lipTextureImageU,
    dimension,
    alphaValue
  );
  drawLowerLip(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    LOWER_LIP_INDICES,
    lipColor,
    lipTextureImageL,
    dimension,
    alphaValue
  );

  canvasCtx.globalCompositeOperation = COMPOSITE_OPERATION;
  canvasCtx.drawImage(tempCanvas, 0, 0);

  const tempLowerLipDotCanvas = document.createElement("canvas");
  tempLowerLipDotCanvas.width = dimension.width;
  tempLowerLipDotCanvas.height = dimension.height;
  const tempLowerLipDotCtx = tempLowerLipDotCanvas.getContext("2d")!;

  clipLipsOnFace(
    tempLowerLipDotCanvas,
    tempLowerLipDotCtx,
    faceLandmarks,
    LOWER_LIP_INDICES
  );
  tempLowerLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  const tempUpperLipDotCanvas = document.createElement("canvas");
  tempUpperLipDotCanvas.width = dimension.width;
  tempUpperLipDotCanvas.height = dimension.height;
  const tempUpperLipDotCtx = tempUpperLipDotCanvas.getContext("2d")!;

  clipLipsOnFace(
    tempUpperLipDotCanvas,
    tempUpperLipDotCtx,
    faceLandmarks,
    UPPER_LIP_INDICES
  );
  tempUpperLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  canvasCtx.globalAlpha = 0.8;
  canvasCtx.globalCompositeOperation = "source-over";
  canvasCtx.drawImage(tempLowerLipDotCanvas, 0, 0);
  canvasCtx.drawImage(tempUpperLipDotCanvas, 0, 0);
  canvasCtx.filter = `blur(${BLUR_AMOUNT_2}px)`;
  canvasCtx.globalAlpha = 0.75;
  canvasCtx.globalCompositeOperation = "source-over";
}

export function applyTextureOnLipsc(
  faceLandmarks: NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D,
  lipColor: Color,
  lipTextureImageL: HTMLImageElement,
  lipTextureImageU: HTMLImageElement,
  dimension: { height: number; width: number },
  alphaValue: any
) {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = dimension.width;
  tempCanvas.height = dimension.height;
  const tempCtx = tempCanvas.getContext("2d")!;

  drawUpperLipc(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    UPPER_LIP_INDICES,
    lipColor,
    lipTextureImageU,
    alphaValue
  );
  drawLowerLipc(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    LOWER_LIP_INDICES,
    lipColor,
    lipTextureImageL,
    alphaValue
  );

  canvasCtx.globalCompositeOperation = COMPOSITE_OPERATION;
  canvasCtx.drawImage(tempCanvas, 0, 0);

  const tempLowerLipDotCanvas = document.createElement("canvas");
  tempLowerLipDotCanvas.width = dimension.width;
  tempLowerLipDotCanvas.height = dimension.height;
  const tempLowerLipDotCtx = tempLowerLipDotCanvas.getContext("2d")!;

  clipLipsOnFace(
    tempLowerLipDotCanvas,
    tempLowerLipDotCtx,
    faceLandmarks,
    LOWER_LIP_INDICES
  );
  tempLowerLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  const tempUpperLipDotCanvas = document.createElement("canvas");
  tempUpperLipDotCanvas.width = dimension.width;
  tempUpperLipDotCanvas.height = dimension.height;
  const tempUpperLipDotCtx = tempUpperLipDotCanvas.getContext("2d")!;

  clipLipsOnFace(
    tempUpperLipDotCanvas,
    tempUpperLipDotCtx,
    faceLandmarks,
    UPPER_LIP_INDICES
  );
  tempUpperLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  canvasCtx.globalAlpha = 0.8;
  canvasCtx.globalCompositeOperation = "source-over";
  canvasCtx.drawImage(tempLowerLipDotCanvas, 0, 0);
  canvasCtx.drawImage(tempUpperLipDotCanvas, 0, 0);
  canvasCtx.filter = `blur(${BLUR_AMOUNT_2}px)`;
  canvasCtx.globalAlpha = 0.75;
  canvasCtx.globalCompositeOperation = "source-over";
}

export function applyTextureOnLipss(
  faceLandmarks: NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D,
  lipColor: Color,
  lipTextureImageL: HTMLImageElement,
  lipTextureImageU: HTMLImageElement,
  dimension: { height: number; width: number },
  alphaValue: any
) {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = dimension.width;
  tempCanvas.height = dimension.height;
  const tempCtx = tempCanvas.getContext("2d")!;

  drawUpperLips(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    UPPER_LIP_INDICES,
    lipColor,
    lipTextureImageU,
    dimension,
    alphaValue
  );
  drawLowerLips(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    LOWER_LIP_INDICES,
    lipColor,
    lipTextureImageL,
    dimension,
    alphaValue
  );

  canvasCtx.globalCompositeOperation = COMPOSITE_OPERATION;
  canvasCtx.drawImage(tempCanvas, 0, 0);

  const tempLowerLipDotCanvas = document.createElement("canvas");
  tempLowerLipDotCanvas.width = dimension.width;
  tempLowerLipDotCanvas.height = dimension.height;
  const tempLowerLipDotCtx = tempLowerLipDotCanvas.getContext("2d")!;

  clipLipsOnFace(
    tempLowerLipDotCanvas,
    tempLowerLipDotCtx,
    faceLandmarks,
    LOWER_LIP_INDICES
  );
  tempLowerLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  const tempUpperLipDotCanvas = document.createElement("canvas");
  tempUpperLipDotCanvas.width = dimension.width;
  tempUpperLipDotCanvas.height = dimension.height;
  const tempUpperLipDotCtx = tempUpperLipDotCanvas.getContext("2d")!;

  clipLipsOnFace(
    tempUpperLipDotCanvas,
    tempUpperLipDotCtx,
    faceLandmarks,
    UPPER_LIP_INDICES
  );
  tempUpperLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  canvasCtx.globalAlpha = 0.8;
  canvasCtx.globalCompositeOperation = "source-over";
  canvasCtx.drawImage(tempLowerLipDotCanvas, 0, 0);
  canvasCtx.drawImage(tempUpperLipDotCanvas, 0, 0);
  canvasCtx.filter = `blur(${BLUR_AMOUNT_2}px)`;
  canvasCtx.globalAlpha = 0.75;
  canvasCtx.globalCompositeOperation = "source-over";
}

function drawUpperLip(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  upperLipIndices: number[],
  lipColor: Color,
  texture: HTMLImageElement,
  dimension: { height: number; width: number },
  alphaValue: any
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, upperLipIndices);

  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, upperLipIndices);
  fillColor(canvasCtx, lipColor, 0.6);
  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, upperLipIndices);
  //applyTexture(canvasCtx, faceLandmarks, LOWER_LIP_INDICES, texture);
  /* applyTexture(canvasCtx, faceLandmarks, CombinedLipIndices, texture);
  applyTexture(canvasCtx, faceLandmarks, CombinedLipIndices, texture); */
  //applyTexture(canvasCtx, faceLandmarks,LOWER_LIP_INDICES, texture);
  //applyTexture(canvasCtx, faceLandmarks,LOWER_LIP_INDICES, texture);

  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/
  )!;

  const r = parseInt(rgbaMatch[1]); // Red value
  const g = parseInt(rgbaMatch[2]); // Green value
  const b = parseInt(rgbaMatch[3]); // Blue value
  //console.log(r, g, b, isBrightColor(r, g, b));
  if (isBrightColor(r, g, b) == 1) {
    const upperlipop = 0.3;
    applyTexture(
      canvasCtx,
      faceLandmarks,
      upperLipIndices,
      texture,
      upperlipop
    );
  } else {
    const inop = 0.3;
    const upperlipop = 0.1;

    applyTexture(
      canvasCtx,
      faceLandmarks,
      upperLipIndices,
      texture,
      upperlipop
    ); //  LOWER_WHITE_LIP_INDICESFSET
    applyTexture(
      canvasCtx,
      faceLandmarks,
      UPPER_WHITE_LIP_INDICESFSET,
      texture,
      inop
    );
  }

  applyLipFilters(canvasCtx, dimension, alphaValue);
  canvasCtx.restore();
}
function drawUpperLipc(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  upperLipIndices: number[],
  lipColor: Color,
  texture: HTMLImageElement,
  alphaValue: any
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, upperLipIndices);

  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, upperLipIndices);
  fillColor(canvasCtx, lipColor, alphaValue);
  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, upperLipIndices);
  //applyTexture(canvasCtx, faceLandmarks, LOWER_LIP_INDICES, texture);
  /* applyTexture(canvasCtx, faceLandmarks, CombinedLipIndices, texture);
  applyTexture(canvasCtx, faceLandmarks, CombinedLipIndices, texture); */
  //applyTexture(canvasCtx, faceLandmarks,LOWER_LIP_INDICES, texture);
  //applyTexture(canvasCtx, faceLandmarks,LOWER_LIP_INDICES, texture);

  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/
  )!;

  const r = parseInt(rgbaMatch[1]); // Red value
  const g = parseInt(rgbaMatch[2]); // Green value
  const b = parseInt(rgbaMatch[3]); // Blue value
  //console.log(r, g, b, isBrightColor(r, g, b));
  if (isBrightColor(r, g, b) == 1) {
    const upperlipop = 0.1;
    applyTexture(
      canvasCtx,
      faceLandmarks,
      upperLipIndices,
      texture,
      upperlipop
    );
  } else {
    const inop = 0.2;
    const upperlipop = 0.1;

    applyTexture(
      canvasCtx,
      faceLandmarks,
      upperLipIndices,
      texture,
      upperlipop
    ); //  LOWER_WHITE_LIP_INDICESFSET
    applyTexture(
      canvasCtx,
      faceLandmarks,
      UPPER_WHITE_LIP_INDICESFSET,
      texture,
      inop
    );
  }

  //applyLipFilters(canvasCtx, dimension);
  canvasCtx.restore();
}

function drawUpperLips(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  upperLipIndices: number[],
  lipColor: Color,
  texture: HTMLImageElement,
  dimension: { height: number; width: number },
  alphaValue: any
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, upperLipIndices);

  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, upperLipIndices);
  fillColor(canvasCtx, lipColor, 0.4);
  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, upperLipIndices);
  //applyTexture(canvasCtx, faceLandmarks, LOWER_LIP_INDICES, texture);
  /* applyTexture(canvasCtx, faceLandmarks, CombinedLipIndices, texture);
  applyTexture(canvasCtx, faceLandmarks, CombinedLipIndices, texture); */
  //applyTexture(canvasCtx, faceLandmarks,LOWER_LIP_INDICES, texture);
  //applyTexture(canvasCtx, faceLandmarks,LOWER_LIP_INDICES, texture);

  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/
  )!;

  const r = parseInt(rgbaMatch[1]); // Red value
  const g = parseInt(rgbaMatch[2]); // Green value
  const b = parseInt(rgbaMatch[3]); // Blue value
  //console.log(r, g, b, isBrightColor(r, g, b));
  if (isBrightColor(r, g, b) == 1) {
    const upperlipop = 0.7;
    applyTexture(
      canvasCtx,
      faceLandmarks,
      upperLipIndices,
      texture,
      upperlipop
    );
  } else {
    const inop = 0.9;
    const upperlipop = 0.7;

    applyTexture(
      canvasCtx,
      faceLandmarks,
      upperLipIndices,
      texture,
      upperlipop
    ); //  LOWER_WHITE_LIP_INDICESFSET
    applyTexture(
      canvasCtx,
      faceLandmarks,
      UPPER_WHITE_LIP_INDICESFSET,
      texture,
      inop
    );
  }

  applyLipFilters(canvasCtx, dimension, alphaValue);
  canvasCtx.restore();
}
function drawLowerLip(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lowerLipIndices: number[],
  lipColor: Color,
  texture: HTMLImageElement,
  dimension: {
    height: number;
    width: number;
  },
  alphaValue: any
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, lowerLipIndices);

  fillColor(canvasCtx, lipColor, 0.4);

  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/
  )!;

  const r = parseInt(rgbaMatch[1]); // Red value
  const g = parseInt(rgbaMatch[2]); // Green value
  const b = parseInt(rgbaMatch[3]); // Blue value
  //console.log(r, g, b, isBrightColor(r, g, b));
  if (isBrightColor(r, g, b) == 1) {
    const lowerlipop = 0.1;
    applyTexture(
      canvasCtx,
      faceLandmarks,
      lowerLipIndices,
      texture,
      lowerlipop
    );
  } else {
    const inop = 0.3;
    const lowerlipop = 0.1;

    applyTexture(
      canvasCtx,
      faceLandmarks,
      lowerLipIndices,
      texture,
      lowerlipop
    ); //  LOWER_WHITE_LIP_INDICESFSET
    applyTexture(
      canvasCtx,
      faceLandmarks,
      LOWER_WHITE_LIP_INDICESFSET,
      texture,
      inop
    );
  }
  //  LOWER_WHITE_LIP_INDICESFSET

  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, lowerLipIndices);

  applyLipFilters(canvasCtx, dimension, alphaValue);
  canvasCtx.restore();
}

function drawLowerLipc(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lowerLipIndices: number[],
  lipColor: Color,
  texture: HTMLImageElement,
  alphaValue: any
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, lowerLipIndices);

  fillColor(canvasCtx, lipColor, alphaValue);

  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/
  )!;

  const r = parseInt(rgbaMatch[1]); // Red value
  const g = parseInt(rgbaMatch[2]); // Green value
  const b = parseInt(rgbaMatch[3]); // Blue value
  //console.log(r, g, b, isBrightColor(r, g, b));
  if (isBrightColor(r, g, b) == 1) {
    const lowerlipop = 0.1;
    applyTexture(
      canvasCtx,
      faceLandmarks,
      lowerLipIndices,
      texture,
      lowerlipop
    );
  } else {
    const inop = 0.2;
    const lowerlipop = 0.1;

    applyTexture(
      canvasCtx,
      faceLandmarks,
      lowerLipIndices,
      texture,
      lowerlipop
    ); //  LOWER_WHITE_LIP_INDICESFSET
    applyTexture(
      canvasCtx,
      faceLandmarks,
      LOWER_WHITE_LIP_INDICESFSET,
      texture,
      inop
    );
  }
  //  LOWER_WHITE_LIP_INDICESFSET

  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, lowerLipIndices);

  //applyLipFilters(canvasCtx, dimension);
  canvasCtx.restore();
}
function drawLowerLips(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lowerLipIndices: number[],
  lipColor: Color,
  texture: HTMLImageElement,
  dimension: {
    height: number;
    width: number;
  },
  alphaValue: any
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, lowerLipIndices);

  fillColor(canvasCtx, lipColor, 0.4);

  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/
  )!;

  const r = parseInt(rgbaMatch[1]); // Red value
  const g = parseInt(rgbaMatch[2]); // Green value
  const b = parseInt(rgbaMatch[3]); // Blue value
  //console.log(r, g, b, isBrightColor(r, g, b));
  if (isBrightColor(r, g, b) == 1) {
    const lowerlipop = 0.7;
    applyTexture(
      canvasCtx,
      faceLandmarks,
      lowerLipIndices,
      texture,
      lowerlipop
    );
  } else {
    const inop = 0.9;
    const lowerlipop = 0.7;

    applyTexture(
      canvasCtx,
      faceLandmarks,
      lowerLipIndices,
      texture,
      lowerlipop
    ); //  LOWER_WHITE_LIP_INDICESFSET
    applyTexture(
      canvasCtx,
      faceLandmarks,
      LOWER_WHITE_LIP_INDICESFSET,
      texture,
      inop
    );
  }
  //  LOWER_WHITE_LIP_INDICESFSET

  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, lowerLipIndices);
  // console.log("shimmer");
  applyLipFilters(canvasCtx, dimension, alphaValue);
  canvasCtx.restore();
}

function drawUpperLipm(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  upperLipIndices: number[],
  lipColor: Color,
  alphaValue: any
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, upperLipIndices);

  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, upperLipIndices);
  fillColor(canvasCtx, lipColor, alphaValue);
  //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, upperLipIndices);
  //applyTexture(canvasCtx, faceLandmarks, LOWER_LIP_INDICES, texture);
  /* applyTexture(canvasCtx, faceLandmarks, CombinedLipIndices, texture);
  applyTexture(canvasCtx, faceLandmarks, CombinedLipIndices, texture); */
  //applyTexture(canvasCtx, faceLandmarks,LOWER_LIP_INDICES, texture);
  //applyTexture(canvasCtx, faceLandmarks,LOWER_LIP_INDICES, texture);

  canvasCtx.restore();
}

function drawLowerLipm(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lowerLipIndices: number[],
  lipColor: Color,
  alphaValue: any
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, lowerLipIndices);

  fillColor(canvasCtx, lipColor, alphaValue);

  canvasCtx.restore();
}

export function applyOnLips(
  faceLandmarks: NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D,
  lipColor: Color,
  dimension: { height: number; width: number },
  alphaValue: any
) {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = dimension.width;
  tempCanvas.height = dimension.height;
  const tempCtx = tempCanvas.getContext("2d")!;

  drawUpperLipm(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    UPPER_LIP_INDICES,
    lipColor,
    alphaValue
  );
  drawLowerLipm(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    LOWER_LIP_INDICES,
    lipColor,
    alphaValue
  );

  canvasCtx.globalCompositeOperation = COMPOSITE_OPERATION;
  canvasCtx.drawImage(tempCanvas, 0, 0);

  /*const tempLowerLipDotCanvas = document.createElement("canvas");
  tempLowerLipDotCanvas.width = dimension.width;
  tempLowerLipDotCanvas.height = dimension.height;
  const tempLowerLipDotCtx = tempLowerLipDotCanvas.getContext("2d")!;

  clipLipsOnFace(
    tempLowerLipDotCanvas,
    tempLowerLipDotCtx,
    faceLandmarks,
    LOWER_LIP_INDICES
  );
  tempLowerLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  const tempUpperLipDotCanvas = document.createElement("canvas");
  tempUpperLipDotCanvas.width = dimension.width;
  tempUpperLipDotCanvas.height = dimension.height;
  const tempUpperLipDotCtx = tempUpperLipDotCanvas.getContext("2d")!;

  clipLipsOnFace(
    tempUpperLipDotCanvas,
    tempUpperLipDotCtx,
    faceLandmarks,
    UPPER_LIP_INDICES
  );
  tempUpperLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  canvasCtx.globalAlpha = 0.8;
  canvasCtx.globalCompositeOperation = "source-over";
  canvasCtx.drawImage(tempLowerLipDotCanvas, 0, 0);
  canvasCtx.drawImage(tempUpperLipDotCanvas, 0, 0);
  canvasCtx.filter = `blur(${BLUR_AMOUNT_2}px)`;
  canvasCtx.globalAlpha = 0.75;
  canvasCtx.globalCompositeOperation = "source-over"; */
}

function isBrightColor(r: number, g: number, b: number) {
  // Calculate the luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Define the threshold
  const threshold = 128;

  // Determine if the color is bright or dark
  //console.log(luminance);
  return luminance > threshold ? 1 : 0;
}
function applyLipFilters(
  canvasCtx: CanvasRenderingContext2D,
  dimension: { height: number; width: number },
  alphaValue: any
) {
  // Adjust the filter settings to enhance lip colors
  canvasCtx.filter = "contrast(1.1) saturate(1.1)";
  canvasCtx.globalAlpha = alphaValue; // Ensure full opacity while applying filters
  canvasCtx.fillRect(0, 0, dimension.width, dimension.height); // Apply the filter to the entire canvas
  canvasCtx.filter = "none"; // Reset filters after application
}
function fillColor(
  canvasCtx: CanvasRenderingContext2D,
  fillColor: Color,
  alpha: number
) {
  canvasCtx.fillStyle = fillColor;
  canvasCtx.globalAlpha = alpha;
  canvasCtx.fill();
}
function clipLipsOnFace(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lipIndices: number[]
) {
  canvasCtx.beginPath();
  lipIndices.forEach((index, i) => {
    const point = faceLandmarks[index];
    const x = point.x * canvasElement.width;
    const y = point.y * canvasElement.height;
    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
  });
  canvasCtx.closePath();
  canvasCtx.clip();
}

export function applyTexture(
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lipIndices: number[],
  texture: HTMLImageElement,
  OPACITY: number
) {
  const padding = 5; // Adjust the padding for smoothness
  const paddedIndices = lipIndices.map((index) => {
    const point = faceLandmarks[index];
    return {
      x: point.x * canvasCtx.canvas.width,
      y: point.y * canvasCtx.canvas.height,
    };
  });
  canvasCtx.save();
  canvasCtx.beginPath();
  canvasCtx.moveTo(paddedIndices[0].x - padding, paddedIndices[0].y - padding);

  // Create circular curves using quadraticCurveTo
  paddedIndices.forEach((point, i) => {
    if (i > 0) {
      const previousPoint = paddedIndices[i - 1];
      const cpX = (previousPoint.x + point.x) / 2;
      const cpY = (previousPoint.y + point.y) / 2;
      canvasCtx.quadraticCurveTo(previousPoint.x, previousPoint.y, cpX, cpY);
    }
  });

  // Close the circular path with a smooth curve
  const lastPoint = paddedIndices[paddedIndices.length - 1];
  canvasCtx.quadraticCurveTo(
    lastPoint.x,
    lastPoint.y,
    paddedIndices[0].x - padding,
    paddedIndices[0].y - padding
  );
  canvasCtx.closePath();

  // Clip to the lip shape
  canvasCtx.clip();

  const minX = Math.min(...paddedIndices.map((p) => p.x));
  const minY = Math.min(...paddedIndices.map((p) => p.y));
  const maxX = Math.max(...paddedIndices.map((p) => p.x));
  const maxY = Math.max(...paddedIndices.map((p) => p.y));

  // Center offsets for scaling

  /* const minX = Math.min(...lipPoints.map((p) => p.x));
  const maxX = Math.max(...lipPoints.map((p) => p.x));
  const minY = Math.min(...lipPoints.map((p) => p.y));
  const maxY = Math.max(...lipPoints.map((p) => p.y)); */

  canvasCtx.globalAlpha = OPACITY;
  canvasCtx.drawImage(texture, minX, minY, maxX - minX, maxY - minY);
  //canvasCtx.drawImage(texture,0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height );

  //canvasCtx.globalAlpha = 1.0;
  canvasCtx.restore();
}
