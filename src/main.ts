import {
  FilesetResolver,
  FaceLandmarker,
  FaceLandmarkerResult,
  // NormalizedLandmark,
} from "@mediapipe/tasks-vision";
// import cv from "@techstark/opencv-js";
import {
  GLOSSY_TEXTURE_PATHU,
  GLOSSY_TEXTURE_PATHL,
  CRAYON_TEXTURE_PATHU,
  CRAYON_TEXTURE_PATHL,
  SHIMMER_TEXTURE_PATHU,
  SHIMMER_TEXTURE_PATHL,
  BLUR_AMOUNT_2,
  // LOWER_LIP_INDICES,
} from "./indices";
import {
  applyOnLips,
  applyTextureOnLips,
  applyTextureOnLipss,
  applyTextureOnLipsc,
  loadImage,
} from "./lips";
import {
  pattern_1_indices,
  pattern_2_indices,
  pattern_4_indices,
  pattern_4_thick_indices,
  pattern_4_thin_indices,
  right_eyebrow_indices,
  left_eyebrow_indices,
  left_eyeshadow_indices,
  right_eyeshadow_indices,
} from "./indices";

type ColorTuple = [number, number, number, number];

type MakeupState = {
  lips: boolean;
  lipsType: string;
  eyebrow: boolean;
  face: boolean;
  foundation: boolean;
  blush: boolean;
  eyeshadow?: boolean;
  eyeliner: boolean;
  kajal: boolean;
  eyeLinerPattern: string;
  KajalPattern: string;
  lipColor: ColorTuple;
  eyebrowColor: ColorTuple;
  eyeshadowColor: ColorTuple;
  rangeValue: number;
};
declare global {
  interface Window {
    makeupState: MakeupState;
    takeSnapshot: boolean;
  }
}

export async function startTryon() {
  let webcamRunning: Boolean = false;

  // const videoHeight = `${260 * 2}px`;
  // const videoWidth = `${350 * 2}px`;

  // Before we can use PoseLandmarker class we must wait for it to finish
  // loading. Machine Learning models can be large and take a moment to
  // get everything needed to run.

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  const canvasElement = document.getElementById(
    "output_canvas"
  ) as HTMLCanvasElement;
  const canvasElement2 = document.getElementById(
    "output_canvas2"
  ) as HTMLCanvasElement;

  const range = document.getElementById("range") as HTMLInputElement;

  range.addEventListener("change", function (e: any) {
    window.makeupState.rangeValue = e.target.value / 100;
  });
  // const facedetector = await FaceDetector.createFromOptions(vision, {
  //   baseOptions: {
  //     modelAssetPath: "blaze_face_short_range.tflite",
  //     delegate: "GPU",
  //   },
  //   runningMode: runningMode,
  //   canvas: canvasElement,
  // });
  const faceLandMarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    canvas: canvasElement,
    numFaces: 1,
  });

  /********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/

  function applyEyeLashes(
    faceLandmarkerResult: any,
    canvasCtx: any,
    pattern_name: string,
    rightEyePoints: any,
    leftEyePoints: any,
    alphaValue: any
  ) {
    if (faceLandmarkerResult.faceLandmarks) {
      for (const landmarks of faceLandmarkerResult.faceLandmarks) {
        applyTextureOnEyes(
          landmarks,
          canvasCtx,
          pattern_name,
          rightEyePoints,
          leftEyePoints,
          alphaValue
        );
      }
    }
  }

  function addBlushEffect(
    ctx: any,
    landmarks: any,
    width: any,
    height: any,
    rightCheekPoint: any,
    leftCheekPoint: any
  ) {
    const leftCheek = landmarks[rightCheekPoint];
    const rightCheek = landmarks[leftCheekPoint];

    const leftBoundary = landmarks[118];
    const rightBoundary = landmarks[346];

    const leftMaxRadius = Math.abs((leftBoundary.x - leftCheek.x) * width);
    const rightMaxRadius = Math.abs((rightBoundary.x - rightCheek.x) * width);

    const defaultRadius = width * 0.1;
    const leftBlushRadius = Math.min(defaultRadius, leftMaxRadius);
    const rightBlushRadius = Math.min(defaultRadius, rightMaxRadius);

    const positions = [
      {
        x: leftCheek.x * width,
        y: leftCheek.y * height,
        radius: leftBlushRadius,
      },
      {
        x: rightCheek.x * width,
        y: rightCheek.y * height,
        radius: rightBlushRadius,
      },
    ];

    for (const pos of positions) {
      const gradient = ctx.createRadialGradient(
        pos.x,
        pos.y,
        0,
        pos.x,
        pos.y,
        pos.radius
      );
      gradient.addColorStop(0, "rgba(255, 150, 150, 0.7)");
      gradient.addColorStop(1, "rgba(255, 150, 150, 0)");

      ctx.filter = "blur(5px)";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.filter = "none";
    }
  }

  function applyTextureOnEyes(
    faceLandmarks: any,
    canvasCtx: any,
    pattern_name: string,
    rightEyePoints: any,
    leftEyePoints: any,
    alphaValue: any
  ) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasElement.width;
    tempCanvas.height = canvasElement.height;
    const tempCtx = tempCanvas.getContext("2d");

    rightEyePoints.forEach((point: any) => {
      drawEye(
        tempCanvas,
        tempCtx,
        faceLandmarks,
        point.points,
        point.webCamWidth,
        alphaValue
      );
    });

    if (pattern_name === "pattern1") {
      canvasCtx.beginPath();
      const x =
        faceLandmarks[rightEyePoints[rightEyePoints.length - 3].points[1]].x *
        canvasElement.width;
      const y =
        faceLandmarks[rightEyePoints[rightEyePoints.length - 3].points[1]].y *
        canvasElement.height;

      const x1 =
        faceLandmarks[rightEyePoints[rightEyePoints.length - 1].points[1]].x *
        canvasElement.width;
      const y1 =
        faceLandmarks[rightEyePoints[rightEyePoints.length - 1].points[1]].y *
        canvasElement.height;

      var y1_offset = 0;
      var y2_offset = 0;
      var x2_offset = 0;

      canvasCtx.moveTo(x, y + y1_offset);
      canvasCtx.quadraticCurveTo(x + x2_offset, y + y2_offset, x1, y1);

      canvasCtx.closePath();
      canvasCtx.fill();
    } else if (pattern_name === "pattern4") {
      canvasCtx.beginPath();
      const x = faceLandmarks[263].x * canvasElement.width;
      const y = faceLandmarks[263].y * canvasElement.height;

      const x1 = faceLandmarks[353].x * canvasElement.width;
      const y1 = faceLandmarks[353].y * canvasElement.height;

      const midX2 = (x + x1) / 2;
      const midY2 = (y + y1) / 2;

      var x1_offset = 0;
      var y1_offset = 0;
      var y2_offset = 0;
      var x2_offset = 0;

      canvasCtx.moveTo(x + x1_offset, y + y1_offset);
      canvasCtx.quadraticCurveTo(x + x2_offset, y + y2_offset, midX2, midY2);

      canvasCtx.closePath();
      canvasCtx.fill();
    }

    leftEyePoints.forEach((point: any) => {
      drawEye(
        tempCanvas,
        tempCtx,
        faceLandmarks,
        point.points,
        point.webCamWidth,
        alphaValue
      );
    });

    if (pattern_name === "pattern1") {
      canvasCtx.beginPath();
      const x2 =
        faceLandmarks[leftEyePoints[leftEyePoints.length - 3].points[1]].x *
        canvasElement.width;
      const y2 =
        faceLandmarks[leftEyePoints[leftEyePoints.length - 3].points[1]].y *
        canvasElement.height;

      const x3 =
        faceLandmarks[leftEyePoints[leftEyePoints.length - 1].points[1]].x *
        canvasElement.width;
      const y3 =
        faceLandmarks[leftEyePoints[leftEyePoints.length - 1].points[1]].y *
        canvasElement.height;

      var y3_offset: number = 0;
      var y4_offset: number = 0;
      var x4_offset: number = 0;

      canvasCtx.moveTo(x2, y2 + y3_offset);
      canvasCtx.quadraticCurveTo(x2 + x4_offset, y2 + y4_offset, x3, y3);

      canvasCtx.closePath();
      canvasCtx.fill();
    } else if (pattern_name === "pattern4") {
      canvasCtx.beginPath();
      const x = faceLandmarks[33].x * canvasElement.width;
      const y = faceLandmarks[33].y * canvasElement.height;

      const x1 = faceLandmarks[124].x * canvasElement.width;
      const y1 = faceLandmarks[124].y * canvasElement.height;

      const midX2 = (x + x1) / 2;
      const midY2 = (y + y1) / 2;

      var x1_offset = 0;
      var y1_offset = 0;
      var y2_offset = 0;
      var x2_offset = 0;

      canvasCtx.moveTo(x + x1_offset, y + y1_offset);
      canvasCtx.quadraticCurveTo(x + x2_offset, y + y2_offset, midX2, midY2);

      canvasCtx.closePath();
      canvasCtx.fill();
    }

    canvasCtx.globalCompositeOperation = "overlay";
    canvasCtx.drawImage(tempCanvas, 0, 0);
  }

  function drawEye(
    canvasElement: any,
    canvasCtx: any,
    faceLandmarks: any,
    indices: any,
    line_width: any,
    alphaValue: any
  ) {
    canvasCtx.save();

    clip(
      canvasElement,
      canvasCtx,
      faceLandmarks,
      indices,
      line_width,
      alphaValue
    );

    canvasCtx.restore();
  }

  function clip(
    canvasElement: any,
    canvasCtx: any,
    faceLandmarks: any,
    indices: any,
    line_width: any,
    alphaValue: any
  ) {
    canvasCtx.lineWidth = 0.5;

    canvasCtx.lineCap = "round";
    canvasCtx.lineJoin = "round";

    canvasCtx.strokeStyle = `rgba(0, 0, 0, ${alphaValue})`;
    canvasCtx.beginPath();

    indices.forEach((value: any, i: number) => {
      const point = faceLandmarks[value];
      const x = point.x * canvasElement.width;
      const y = point.y * canvasElement.height;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        const prevPoint = faceLandmarks[indices[i - 1]];
        const prevX = prevPoint.x * canvasElement.width;
        const prevY = prevPoint.y * canvasElement.height;

        const midX2 = (prevX + x) / 2;
        const midY2 = (prevY + y) / 2;

        const midX1 = (prevX + midX2) / 2;
        const midY1 = (prevY + midY2) / 2;

        const midX3 = (midX2 + x) / 2;
        const midY3 = (midY2 + y) / 2;

        canvasCtx.lineWidth = line_width[0];
        canvasCtx.beginPath();
        canvasCtx.moveTo(prevX, prevY);
        canvasCtx.lineTo(midX1, midY1);
        canvasCtx.stroke();

        canvasCtx.lineWidth = line_width[1];
        canvasCtx.beginPath();
        canvasCtx.moveTo(midX1, midY1);
        canvasCtx.lineTo(midX2, midY2);
        canvasCtx.stroke();

        if (line_width[2] !== 0) {
          canvasCtx.lineWidth = line_width[2];
          canvasCtx.beginPath();
          canvasCtx.moveTo(midX2, midY2);
          canvasCtx.lineTo(midX3, midY3);
          canvasCtx.stroke();

          canvasCtx.quadraticCurveTo(midX2, midY2, midX3, midY3);
        }

        if (line_width[3] !== 0) {
          canvasCtx.lineWidth = line_width[2];
          canvasCtx.beginPath();
          canvasCtx.moveTo(midX3, midY3);
          canvasCtx.lineTo(x, y);
          canvasCtx.stroke();
          canvasCtx.quadraticCurveTo(midX3, midY3, x, y);
        }

        canvasCtx.quadraticCurveTo(prevX, prevY, midX1, midY1);
        canvasCtx.quadraticCurveTo(midX1, midY1, midX2, midY2);
      }
    });

    canvasCtx.closePath();
    canvasCtx.stroke();
  }

  function applyEyeBrow(
    faceLandmarks: any,
    canvasCtx: any,
    eyebrowColor: any,
    right_indices: any,
    left_indices: any,
    alphaValue: any
  ) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasElement2.width;
    tempCanvas.height = canvasElement2.height;
    const tempCtx = tempCanvas.getContext("2d");

    drawEyebrow(
      tempCanvas,
      tempCtx,
      faceLandmarks,
      left_indices,
      eyebrowColor,
      alphaValue
    );

    drawEyebrow(
      tempCanvas,
      tempCtx,
      faceLandmarks,
      right_indices,
      eyebrowColor,
      alphaValue
    );
    canvasCtx.globalAlpha = 0.75;
    canvasCtx.globalCompositeOperation = "source-over";
    canvasCtx.filter = `blur(${BLUR_AMOUNT_2}px)`;
    canvasCtx.drawImage(tempCanvas, 0, 0);
  }

  function applyEyeShadow(
    faceLandmarks: any,
    canvasCtx: any,
    eyebrowColor: any,
    right_indices: any,
    left_indices: any,
    alphaValue: any
  ) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasElement2.width;
    tempCanvas.height = canvasElement2.height;
    const tempCtx = tempCanvas.getContext("2d");

    drawEyeShadow(
      tempCanvas,
      tempCtx,
      faceLandmarks,
      left_indices,
      eyebrowColor,
      alphaValue
    );

    drawEyeShadow(
      tempCanvas,
      tempCtx,
      faceLandmarks,
      right_indices,
      eyebrowColor,
      alphaValue
    );
    canvasCtx.globalCompositeOperation = "overlay";
    canvasCtx.drawImage(tempCanvas, 0, 0);
  }

  function drawEyebrow(
    canvasElement: any,
    canvasCtx: any,
    faceLandmarks: any,
    eyebrow_indices: any,
    eyebrowColor: any,
    alphaValue: any
  ) {
    canvasCtx.save();
    clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, eyebrow_indices);

    //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, upperLipIndices);
    fillColor(canvasCtx, eyebrowColor, alphaValue);

    //applyLipFilters(canvasCtx);
    canvasCtx.restore();
  }

  function drawEyeShadow(
    canvasElement: any,
    canvasCtx: any,
    faceLandmarks: any,
    eyebrow_indices: any,
    eyebrowColor: any,
    alphaValue: any
  ) {
    canvasCtx.save();
    clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, eyebrow_indices);

    //fillGlossyGradientOnLip(canvasCtx, faceLandmarks, upperLipIndices);
    fillColor(canvasCtx, eyebrowColor, alphaValue);

    canvasCtx.restore();
  }

  function clipLipsOnFace(
    canvasElement: any,
    canvasCtx: any,
    faceLandmarks: any,
    lipIndices: any
  ) {
    canvasCtx.beginPath();
    lipIndices.forEach((index: any, i: any) => {
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

  function fillColor(canvasCtx: any, fillColor: any, alpha: any) {
    canvasCtx.fillStyle = fillColor;
    canvasCtx.globalAlpha = alpha;
    canvasCtx.fill();
  }

  // function applyLipFilters(canvasCtx: any) {
  //   // Adjust the filter settings to enhance lip colors
  //   canvasCtx.filter = "contrast(1.1) saturate(1.1)";
  //   canvasCtx.globalAlpha = 0.8; // Ensure full opacity while applying filters
  //   canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height); // Apply the filter to the entire canvas
  //   canvasCtx.filter = "none"; // Reset filters after application
  // }

  const video = document.getElementById("webcam") as HTMLVideoElement;

  // Check if webcam access is supported.
  const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

  // If webcam supported, add event listener to button for when user
  // wants to activate it.
  if (hasGetUserMedia()) {
    enableCam();
  } else {
    console.warn("getUserMedia() is not supported by your browser");
  }

  // Enable the live webcam view and start detection.
  async function enableCam() {
    if (!faceLandMarker) {
      console.log("Wait! facedetector not loaded yet.");
      return;
    }

    if (webcamRunning === true) {
      webcamRunning = false;
    } else {
      webcamRunning = true;
    }

    // Activate the webcam stream.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }

  function resizeElements() {
    const videoAspectRatio = Number(
      (video.videoHeight / video.videoWidth).toFixed(2)
    ); // Aspect ratio based on your initial dimensions
    // Check if the device is mobile by screen width
    if (window.innerWidth <= 768) {
      // 768px is commonly used as the breakpoint for tablets and mobile devices
      // For mobile devices, take the full width and height
      // const videoHeight = window.innerHeight; // Full height of the window
      // const videoWidth = window.innerWidth; // Full width of the window
      const videoWidth = window.innerWidth;
      const videoHeight = videoWidth * videoAspectRatio; // Set video height as 66% of the window height
      // Update video and canvas dimensions for mobile
      video.style.height = `${videoHeight}px`;
      video.style.width = `${videoWidth}px`;

      canvasElement2.height = canvasElement.height;
      canvasElement2.width = canvasElement.width;

      canvasElement.style.height = `${videoHeight}px`;
      canvasElement.style.width = `${videoWidth}px`;

      canvasElement2.style.height = `${videoHeight}px`;
      canvasElement2.style.width = `${videoWidth}px`;
    } else {
      // For desktop, maintain the aspect ratio and adjust size
      // const videoHeight = window.innerHeight * 0.66; // Set video height as 66% of the window height
      // const videoWidth = videoHeight * videoAspectRatio; // Adjust width according to the aspect ratio
      const videoWidth = window.innerWidth * 0.65;
      const videoHeight = videoWidth * videoAspectRatio; //

      // Update video and canvas dimensions for desktop
      video.style.height = `${videoHeight}px`;
      video.style.width = `${videoWidth}px`;

      canvasElement2.height = canvasElement.height;
      canvasElement2.width = canvasElement.width;

      canvasElement.style.height = `${videoHeight}px`;
      canvasElement.style.width = `${videoWidth}px`;

      canvasElement2.style.height = `${videoHeight}px`;
      canvasElement2.style.width = `${videoWidth}px`;
    }
  }

  // Resize on window load and on resize event
  // window.addEventListener("resize", resizeElements);
  // window.addEventListener("load", resizeElements);

  function predictWebcam() {
    resizeElements();

    const nowTimeStamp = performance.now();
    const landmark = faceLandMarker.detectForVideo(video, nowTimeStamp);
    applyMakeup(landmark);

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
    }
  }
  const ctx = canvasElement2.getContext("2d");
  if (!ctx) throw "no context found ";

  // const addPolyToMask = (
  //   landmark: NormalizedLandmark[],
  //   mask: cv.MatExpr,
  //   indices: number[],
  //   color: [number, number, number, number]
  // ) => {
  //   const points = indices.map((index) => {
  //     return landmark[index];
  //   });
  //   const CV_points = new cv.MatVector();
  //   const CV_contour = cv.matFromArray(
  //     points.length,
  //     1,
  //     cv.CV_32SC2,
  //     points.flatMap((p) => [
  //       p.x * canvasElement2.width,
  //       p.y * canvasElement2.height,
  //     ])
  //   );
  //   CV_points.push_back(CV_contour);
  //   const CV_color = new cv.Scalar(...color);
  //   // White color for the mask

  //   cv.fillPoly(mask, CV_points, CV_color); //lip

  //   // Apply shine intensity

  //   CV_points.delete();
  //   CV_contour.delete();
  // };

  window.makeupState = {
    lips: true,
    lipsType: "",
    eyebrow: false,
    face: false,
    eyeshadow: false,
    kajal: false,
    eyeliner: false,
    foundation: false,
    blush: false,
    eyeLinerPattern: "",
    KajalPattern: "",
    lipColor: [161, 46, 42, 50],
    eyebrowColor: [0, 0, 18, 0.3],
    eyeshadowColor: [179, 44, 39, 20],
    rangeValue: 0.5,
  };

  const TextureImageL = await loadImage(GLOSSY_TEXTURE_PATHL);
  const TextureImageU = await loadImage(GLOSSY_TEXTURE_PATHU);
  const TextureImageLc = await loadImage(CRAYON_TEXTURE_PATHL);
  const TextureImageUc = await loadImage(CRAYON_TEXTURE_PATHU);

  const TextureImageLs = await loadImage(SHIMMER_TEXTURE_PATHL);
  const TextureImageUs = await loadImage(SHIMMER_TEXTURE_PATHU);

  // const addPolyToMask = (
  //   landmark: NormalizedLandmark[],
  //   mask: cv.MatExpr,
  //   indices: number[],
  //   color: [number, number, number, number]
  // ) => {
  //   const points = indices.map((index) => {
  //     return landmark[index];
  //   });
  //   const CV_points = new cv.MatVector();
  //   const CV_contour = cv.matFromArray(
  //     points.length,
  //     1,
  //     cv.CV_32SC2,
  //     points.flatMap((p) => [
  //       p.x * canvasElement2.width,
  //       p.y * canvasElement2.height,
  //     ])
  //   );
  //   CV_points.push_back(CV_contour);
  //   const CV_color = new cv.Scalar(...color);

  //   cv.fillPoly(mask, CV_points, CV_color);

  //   CV_points.delete();
  //   CV_contour.delete();
  // };

  const extractFaceRegion = (landmarks: any, width: any, height: any) => {
    const boundaryPoints = [
      10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
      378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
      162, 21, 54, 103, 67, 109,
    ];
    return boundaryPoints.map((i) => ({
      x: landmarks[i].x * width,
      y: landmarks[i].y * height,
    }));
  };

  const extractLeftEyeRegion = (landmarks: any, width: any, height: any) => {
    const leftEyePoints = [
      33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163,
      7,
    ].map((i) => ({
      x: landmarks[i].x * width,
      y: landmarks[i].y * height,
    }));
    return leftEyePoints;
  };

  const extractRightEyeRegion = (landmarks: any, width: any, height: any) => {
    const rightEyePoints = [
      362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381,
      382,
    ].map((i) => ({
      x: landmarks[i].x * width,
      y: landmarks[i].y * height,
    }));
    return rightEyePoints;
  };

  const extractLipsRegion = (landmarks: any, width: any, height: any) => {
    // const UPPER_LIP_INDICES = [
    //   61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 311, 312, 13,
    //   82, 81, 80, 191, 78,
    // ];
    // const LOWER_LIP_INDICES = [
    //   61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402,
    //   317, 14, 87, 178, 88, 95, 78,
    // ];

    const lipsPoints = [
      61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17,
      84, 181, 91, 146,
    ].map((i) => ({
      x: landmarks[i].x * width,
      y: landmarks[i].y * height,
    }));
    return lipsPoints;
  };

  const applyTintEffect = (
    canvasCtx: any,
    faceRegion: any,
    excludeRegions: any
  ) => {
    canvasCtx.save();

    canvasCtx.beginPath();
    faceRegion.forEach((point: any, index: number) => {
      if (index === 0) {
        canvasCtx.moveTo(point.x, point.y);
      } else {
        canvasCtx.lineTo(point.x, point.y);
      }
    });
    canvasCtx.closePath();

    canvasCtx.fillStyle = "rgba(255, 0, 0, 0.05)";
    // canvasCtx.fillStyle = "rgba(255, 224, 189, 0.05)";
    canvasCtx.fill();
    canvasCtx.globalCompositeOperation = "destination-out";

    excludeRegions.forEach((region: any) => {
      canvasCtx.beginPath();
      region.forEach((point: any, index: number) => {
        if (index === 0) {
          canvasCtx.moveTo(point.x, point.y);
        } else {
          canvasCtx.lineTo(point.x, point.y);
        }
      });
      canvasCtx.closePath();
      canvasCtx.fill();
    });

    canvasCtx.globalCompositeOperation = "source-over";
    canvasCtx.restore();
  };

  const applyMakeup = (landmark: FaceLandmarkerResult) => {
    if (landmark.faceLandmarks.length === 0) return;
    ctx.clearRect(0, 0, canvasElement2.width, canvasElement2.height);
    ctx.drawImage(video, 0, 0, canvasElement2.width, canvasElement2.height);

    if (window.makeupState.lips) {
      if (window.makeupState.lipsType === "glossy") {
        applyTextureOnLips(
          landmark.faceLandmarks[0],
          ctx,
          `rgba(${window.makeupState.lipColor[0]}, ${window.makeupState.lipColor[1]},  ${window.makeupState.lipColor[2]}, 0.6)`,
          TextureImageL,
          TextureImageU,
          {
            height: canvasElement2.height,
            width: canvasElement2.width,
          },
          window.makeupState.rangeValue
        );
      } else if (window.makeupState.lipsType == "crayon") {
        applyTextureOnLipsc(
          landmark.faceLandmarks[0],
          ctx,
          `rgba(${window.makeupState.lipColor[0]}, ${window.makeupState.lipColor[1]},  ${window.makeupState.lipColor[2]}, 0.6)`,
          TextureImageLc,
          TextureImageUc,
          {
            height: canvasElement2.height,
            width: canvasElement2.width,
          },
          window.makeupState.rangeValue
        );
      } else if (window.makeupState.lipsType == "shimmer") {
        applyTextureOnLipss(
          landmark.faceLandmarks[0],
          ctx,
          `rgba(${window.makeupState.lipColor[0]}, ${window.makeupState.lipColor[1]},  ${window.makeupState.lipColor[2]}, 0.6)`,
          TextureImageLs,
          TextureImageUs,
          {
            height: canvasElement2.height,
            width: canvasElement2.width,
          },
          window.makeupState.rangeValue
        );
      } else if (window.makeupState.lipsType == "matte") {
        applyOnLips(
          landmark.faceLandmarks[0],
          ctx,
          `rgba(${window.makeupState.lipColor[0]}, ${window.makeupState.lipColor[1]},  ${window.makeupState.lipColor[2]}, 0.6)`,
          {
            height: canvasElement2.height,
            width: canvasElement2.width,
          },
          window.makeupState.rangeValue
        );
      }
    }

    if (window.makeupState.eyebrow) {
      applyEyeBrow(
        landmark.faceLandmarks[0],
        ctx,
        window.makeupState.eyebrowColor,
        right_eyebrow_indices,
        left_eyebrow_indices,
        0.3 // default value of range for eyebrow
      );
    }
    if (window.makeupState.eyeshadow) {
      applyEyeShadow(
        landmark.faceLandmarks[0],
        ctx,
        window.makeupState.eyeshadowColor,
        right_eyeshadow_indices,
        left_eyeshadow_indices,
        0.2 // default value of range for eyeshadow
      );
      // const mask = cv.Mat.zeros(
      //   canvasElement2.height,
      //   canvasElement2.width,
      //   cv.CV_8UC4
      // );
      // addPolyToMask(
      //   landmark.faceLandmarks[0],
      //   mask,
      //   right_eyeshadow_indices,
      //   window.makeupState.eyeshadowColor
      // );
      // addPolyToMask(
      //   landmark.faceLandmarks[0],
      //   mask,
      //   left_eyeshadow_indices,
      //   window.makeupState.eyeshadowColor
      // );
      // cv.imshow(canvasElement2, mask);
    }

    if (window.makeupState.eyeliner) {
      let rightEyePoints, leftEyePoints;
      if (window.makeupState.eyeLinerPattern === "pattern1") {
        rightEyePoints = pattern_1_indices.right_eye;
        leftEyePoints = pattern_1_indices.left_eye;
      }
      if (window.makeupState.eyeLinerPattern === "pattern2") {
        rightEyePoints = pattern_2_indices.right_eye;
        leftEyePoints = pattern_2_indices.left_eye;
      }
      if (window.makeupState.eyeLinerPattern === "pattern3") {
        rightEyePoints = pattern_4_indices.right_eye;
        leftEyePoints = pattern_4_indices.left_eye;
      }
      if (rightEyePoints && leftEyePoints) {
        applyEyeLashes(
          landmark,
          ctx,
          window.makeupState.eyeLinerPattern,
          rightEyePoints,
          leftEyePoints,
          window.makeupState.rangeValue
        );
      }
    }
    if (window.makeupState.kajal) {
      let rightEyePoints, leftEyePoints;
      if (window.makeupState.KajalPattern === "pattern1") {
        rightEyePoints = pattern_4_thick_indices.right_eye;
        leftEyePoints = pattern_4_thick_indices.left_eye;
      }
      if (window.makeupState.KajalPattern === "pattern2") {
        rightEyePoints = pattern_4_thin_indices.right_eye;
        leftEyePoints = pattern_4_thin_indices.left_eye;
      }
      if (rightEyePoints && leftEyePoints) {
        applyEyeLashes(
          landmark,
          ctx,
          window.makeupState.KajalPattern,
          rightEyePoints,
          leftEyePoints,
          window.makeupState.rangeValue
        );
      }
    }
    if (window.makeupState.foundation) {
      const faceRegion = extractFaceRegion(
        landmark.faceLandmarks[0],
        canvasElement2.width,
        canvasElement2.height
      );
      const leftEyeRegion = extractLeftEyeRegion(
        landmark.faceLandmarks[0],
        canvasElement2.width,
        canvasElement2.height
      );
      const rightEyeRegion = extractRightEyeRegion(
        landmark.faceLandmarks[0],
        canvasElement2.width,
        canvasElement2.height
      );
      const lipsRegion = extractLipsRegion(
        landmark.faceLandmarks[0],
        canvasElement2.width,
        canvasElement2.height
      );

      if (faceRegion) {
        applyTintEffect(ctx, faceRegion, [
          leftEyeRegion,
          rightEyeRegion,
          lipsRegion,
        ]);
      }
    }
    if (window.makeupState.blush) {
      addBlushEffect(
        ctx,
        landmark.faceLandmarks[0],
        canvasElement2.width,
        canvasElement2.height,
        123,
        352
      );
      addBlushEffect(
        ctx,
        landmark.faceLandmarks[0],
        canvasElement2.width,
        canvasElement2.height,
        50,
        280
      );
      // createBlushEffect(
      //   50,
      //   117,
      //   ctx,
      //   landmark.faceLandmarks[0],
      //   canvasElement2
      // );
      // createBlushEffect(
      //   280,
      //   346,
      //   ctx,
      //   landmark.faceLandmarks[0],
      //   canvasElement2
      // );
    }

    // ctx.restore();

    // ctx.save();
    // ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    // const scaledLandmark = landmark.faceLandmarks[0];

    // const mask = cv.Mat.zeros(
    //   canvasElement2.height,
    //   canvasElement2.width,
    //   cv.CV_8UC4
    // );
    // if (window.makeupState.lips) {

    //   addPolyToMask(scaledLandmark, mask, lips, window.makeupState.lipColor);
    // }
    // if (window.makeupState.eyebrow) {
    //   addPolyToMask(
    //     scaledLandmark,
    //     mask,
    //     right_eyebrow_indices,
    //     window.makeupState.eyebrowColor
    //   );
    //   addPolyToMask(
    //     scaledLandmark,
    //     mask,
    //     left_eyebrow_indices,
    //     window.makeupState.eyebrowColor
    //   );
    // }
    // if (window.makeupState.eyeshadow) {
    //   addPolyToMask(
    //     scaledLandmark,
    //     mask,
    //     right_eyeshadow_indices,
    //     window.makeupState.eyeshadowColor
    //   );
    //   addPolyToMask(
    //     scaledLandmark,
    //     mask,
    //     left_eyeshadow_indices,
    //     window.makeupState.eyeshadowColor
    //   );
    // }

    // cv.imshow(canvasElement2, mask);

    if (window.takeSnapshot) {
      const canvasElement = document.createElement("canvas");
      const ctx = canvasElement.getContext("2d");

      if (!video || !ctx || !canvasElement2) {
        console.error("Required elements are missing.");
        return;
      }

      canvasElement.width = canvasElement2.width;
      canvasElement.height = canvasElement2.height;

      ctx.save();
      ctx.translate(canvasElement.width, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      ctx.drawImage(canvasElement2, 0, 0);

      ctx.restore();

      const link = document.createElement("a");
      link.download = "Snapshot.png";
      link.href = canvasElement.toDataURL("image/png");
      link.click();
      window.takeSnapshot = false;
    }
  };
}

export const takeSnapShot = () => {
  window.takeSnapshot = true;
};
export const setMakeupState = (state: MakeupState) => {
  window.makeupState.lips = state.lips;
  window.makeupState.eyebrow = state.eyebrow;
  window.makeupState.eyeshadow = state.eyeshadow;
  window.makeupState.eyeliner = state.eyeliner;
  window.makeupState.kajal = state.kajal;
  window.makeupState.lipsType = state.lipsType;
  window.makeupState.foundation = state.foundation;
  window.makeupState.blush = state.blush;

  window.makeupState.KajalPattern = state.KajalPattern;
  window.makeupState.eyeLinerPattern = state.eyeLinerPattern;

  const lipAlpha = window.makeupState.lipColor[3];
  // const eyebrowAlpha = window.makeupState.eyebrowColor[3];
  // const eyeshadowAlpha = window.makeupState.eyeshadowColor[3];

  window.makeupState.lipColor = state.lipColor;
  window.makeupState.lipColor[3] = lipAlpha;

  window.makeupState.eyebrowColor = state.eyebrowColor;
  // window.makeupState.eyebrowColor[3] = eyebrowAlpha;

  window.makeupState.eyeshadowColor = state.eyeshadowColor;
  // window.makeupState.eyeshadowColor[3] = eyeshadowAlpha;
};
