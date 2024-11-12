import cv2
import mediapipe as mp
from utils  import *
import numpy as np
from PIL import Image, ImageEnhance
import os
import glob
import numpy as np
from PIL import Image, ImageDraw
 
 
# Initialize MediaPipe face detection 
mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils
 
 

def adjust_gamma(image, gamma=1.0):

   invGamma = 1.0 / gamma
   table = np.array([((i / 255.0) ** invGamma) * 255
      for i in np.arange(0, 256)]).astype("uint8")

   return cv2.LUT(image, table)
    # gamma = 0.5                                   # change the value here to get different result
    # adjusted = adjust_gamma(original, gamma=gamma)
 
def zoom_frame(frame, zoom_factor):
    # Get dimensions of the frame
    height, width = frame.shape[:2]

    # Calculate the center of the frame
    center_x, center_y = width // 2, height // 2

    # Calculate the region to crop (a smaller region means zoomed in)
    new_width = int(width / zoom_factor)
    new_height = int(height / zoom_factor)

    # Ensure the dimensions are within the original frame size
    x1 = max(center_x - new_width // 2, 0)
    x2 = min(center_x + new_width // 2, width)
    y1 = max(center_y - new_height // 2, 0)
    y2 = min(center_y + new_height // 2, height)

    # Crop and resize back to original dimensions
    cropped_frame = frame[y1:y2, x1:x2]
    zoomed_frame = cv2.resize(cropped_frame, (width, height))

    return zoomed_frame





def process_frame(frame,fcnt, new_y,  new_h, new_x , new_w, option):
    frame = cv2.flip(frame, 1)
    oframe =  frame
     
    frame = cv2.bilateralFilter(frame , d=5, sigmaColor=75, sigmaSpace=75)
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.2)  
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    if fcnt == 0:
        results = face_detection.process(image)
        if results.detections:
            for detection in results.detections:
                # Get bounding box for the face
                bboxC = detection.location_data.relative_bounding_box
                ih, iw, _ = image.shape
                x, y, w, h = int(bboxC.xmin * iw), int(bboxC.ymin * ih), int(bboxC.width * iw), int(bboxC.height * ih)
              
                # Define the extension percentage (e.g., 20% extra width and height)
                extension_factor = 1
                extended_w = int(w * (1 + extension_factor))
                extended_h = int(h * (1 + extension_factor))

                # Calculate new coordinates with extended dimensions
                new_x = max(x - (extended_w - w) // 2, 0)
                new_y = max(y - (extended_h - h) // 2, 0)
                new_w = min(extended_w, iw - new_x)
                new_h = min(extended_h, ih - new_y)

                # Crop the face region with extended size
                face_image = image[new_y:new_y+new_h, new_x:new_x+new_w]
                oface_image = oframe[new_y:new_y+new_h, new_x:new_x+new_w]
                feat_applied = face_image
                
                fcnt  = 1
        else:
            print('Pls Come to View one')
            feat_applied = frame
            oface_image = frame
            
    else:
                face_image = image[new_y:new_y+new_h, new_x:new_x+new_w]
                oface_image = image[new_y:new_y+new_h, new_x:new_x+new_w]
   
                                    #1 l 2 eb 3 foundation 4 all 5 l f 6 l e
                if option==1:
                    feat_applied  = apply_makeup(face_image, True, 1,   [18, 44, 150, 255]  ) #lips
                elif option==2:
                    feat_applied  = apply_makeup(face_image, True, 2, [83, 89, 132]   ) # eyeshadow
                elif option==3:
                    feat_applied  = apply_makeup(face_image, True, 3, [1, 1, 10]  ) # ebrow
                                   
                else:
                    feat_applied = face_image
                     
    return feat_applied,oface_image,fcnt, new_y,  new_h, new_x , new_w

zoom_factor= 1.5
# Start capturing video from the webcam
cap = cv2.VideoCapture(0)
 
fcnt =0
  
option = 3
if not cap.isOpened():
    print("Error: Could not open webcam.")
else:    
    fcnt = 0
    while cap.isOpened():
         success, frame = cap.read()
         if not success:
             print("Ignoring empty camera frame.")
             continue
         frame = zoom_frame(frame, zoom_factor)
         
         
         
         if fcnt == 0:
             new_y = 0,
             new_h =  frame.shape[0]
             new_x = 0
             new_w =     frame.shape[0]
         #cv2.imshow("Processed Frame", frame)
         #if cv2.waitKey(1) & 0xFF == 27:  # Press 'Esc' to exit
             #break
         feat_applied,oface_image,fcnt, new_y,  new_h, new_x , new_w = process_frame(frame,fcnt, new_y,  new_h, new_x , new_w, option )
         cv2.imshow("Makeup",  feat_applied)
         cv2.imshow("orginal", oface_image)
         k = cv2.waitKey(1) & 0xFF
         if k  == 27:
             break
     
    cap.release()

 
    cv2.destroyAllWindows()
