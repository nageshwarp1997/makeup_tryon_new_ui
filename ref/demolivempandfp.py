import cv2
import mediapipe as mp
from utilsfp import *
import numpy as np
from PIL import Image, ImageEnhance
import os
 
 
import glob
import torch
import numpy as np
 

 

import numpy as np
from torchvision.transforms.functional import normalize
 
 

from PIL import Image, ImageDraw
import face_recognition
#Video Input from Webcam
#video_capture = cv2.VideoCapture(0)
pavgval = [0, 0, 0]
# Initialize MediaPipe face detection 
mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils
device = 'cpu' # torch.device('cuda' if torch.cuda.is_available() else 'cpu')

 
 



# Start capturing video from the webcam
cap = cv2.VideoCapture(0)
 
fcnt =0
def apply_unsharp_mask(image):
    # Apply Gaussian blur to create a mask
    gaussian_blurred = cv2.GaussianBlur(image, (9, 9), 10.0)
    sharpened = cv2.addWeighted(image,  1.5, gaussian_blurred, -0.5, 0)
    return sharpened
def adjust_gamma(image, gamma=1.0):

   invGamma = 1.0 / gamma
   table = np.array([((i / 255.0) ** invGamma) * 255
      for i in np.arange(0, 256)]).astype("uint8")

   return cv2.LUT(image, table)
    # gamma = 0.5                                   # change the value here to get different result
    # adjusted = adjust_gamma(original, gamma=gamma)
def enhance_contrast_and_brightness(image):
    pil_img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    
    # Enhance contrast
    # enhancer = ImageEnhance.Contrast(pil_img)
    # pil_img = enhancer.enhance(1.5)  # Increase contrast 1.5

    # Enhance brightness slightly
    enhancer = ImageEnhance.Brightness(pil_img)
    pil_img = enhancer.enhance(1.1)

    # Convert back to OpenCV format
    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
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
zoom_factor= 1.5

options =[ 1, 2, 3, 4, 5, 6 ]  # 1 l 2 eb 3 foundation 4 all 5 l f 6 l e
option = options[0]
ff = 0
pframe = 0
liplandmark_buffer = []
with mp_face_detection.FaceDetection(min_detection_confidence=0.2) as face_detection:
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            continue

        # Convert the image to RGB (as MediaPipe works with RGB images)
        frame = zoom_frame(frame, zoom_factor)
        
        frame = cv2.flip(frame, 1)
        oframe =  frame
        sharpened_image = apply_unsharp_mask(frame)

        # # #  # Step 3: Enhance contrast and brightness
        # enhanced_image = enhance_contrast_and_brightness(sharpened_image)

        # # #  # Step 4: Apply bilateral filtering to reduce noise while preserving edges
        frame = cv2.bilateralFilter(sharpened_image, d=9, sigmaColor=45, sigmaSpace=45) #sharpened_image
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        

        #image.flags.writeable = False  # Improve performance by marking the image as not writeable

        # Detect faces in the frame
        results = face_detection.process(image)

        # Convert the image back to BGR for rendering
        #image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        #image =  cv2.bilateralFilter(image, d=5, sigmaColor=75, sigmaSpace=75)#cv2.GaussianBlur(image, (5, 5), 0)
        #cv2.imshow("Original", image)
        if fcnt == 0:
            # Draw face detection annotations and crop the face with extended dimensions
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
                    pframe = feat_applied  
                    # feat_applied, pavgval = apply_makeup(face_image, False, 'foundation', True, pavgval) #foundation
                    # feat_applied, pavgval = apply_makeup(feat_applied, False, 'lips', True, pavgval)
                    fcnt  = 1
        else:
                    face_image = image[new_y:new_y+new_h, new_x:new_x+new_w]
                    oface_image = image[new_y:new_y+new_h, new_x:new_x+new_w]
       
                                        #1 l 2 eb 3 foundation 4 all 5 l f 6 l e
                    if option==1:
                        feat_applied, pframe = apply_makeup(face_image, True, 1, pframe, True  ) #lips
                    elif option==2:
                        feat_applied, pframe = apply_makeup(face_image, True, 2, pframe, True) # eyeshadow
                    elif option==3:
                        feat_applied, pframe = apply_makeup(face_image, True, 3, pframe,True) # ebrow
                    elif option==4:
                        feat_applied, pframe = apply_makeup(face_image, True, 4, pframe, True) #foundation    
                        # feat_applied, pavgval = apply_makeup(feat_applied, False, 'lips', True, pavgval)
                        # feat_applied, pavgval = apply_makeup(feat_applied, False, 'ebrow', True, pavgval) #ebrow
                    # elif option==5:
                    #    feat_applied, pavgval = apply_makeup(face_image, False, 5, True, pavgval) #foundation    
                    #   # feat_applied, pavgval = apply_makeup(feat_applied, False, 'lips', True, pavgval)
                    # elif option==6:
                    #     feat_applied, pavgval = apply_makeup(face_image, False, 6, True, pavgval) #ebrow 
                    #     #feat_applied, pavgval = apply_makeup(feat_applied, False, 'lips', True, pavgval)
                    else:
                        feat_applied = face_image
                         
                        
                    #face_image = cv2.resize(face_image, [640, 480])
                    # Show the cropped face for virtual makeup
        if fcnt == 1:
            #code for post processing
             
            face_size=512,
            fs1= feat_applied.shape[0]
            fs2 = feat_applied.shape[1]
            # feat_appliedn = cv2.resize(feat_applied, (512, 512))
            # # # ------------------ set up FaceRestoreHelper -------------------
            # cropped_face =  feat_appliedn
            # cropped_face_t = img2tensor(cropped_face / 255., bgr2rgb=True, float32=True)
            # normalize(cropped_face_t, (0.5, 0.5, 0.5), (0.5, 0.5, 0.5), inplace=True)
            # cropped_face_t = cropped_face_t.unsqueeze(0).to(device)

            # try:
            #     with torch.no_grad():
            #         output = net(cropped_face_t, w=1, adain=False)[0]
            #         restored_face = tensor2img(output, rgb2bgr=True, min_max=(-1, 1))
            #     del output
            #     torch.cuda.empty_cache()
            # except Exception as error:
            #     print(f'\tFailed inference for CodeFormer: {error}')
            #     restored_face = tensor2img(cropped_face_t, rgb2bgr=True, min_max=(-1, 1))

            # restored_face = restored_face.astype('uint8')
            
            # if option_upscale == 2: #high enhancement
                
                 
            #     brightness = 4
            #     contrast = 1.2
            #     restored_face = cv2.addWeighted(restored_face, contrast, np.zeros(restored_face.shape, restored_face.dtype), 0, brightness)
            # restored_face = cv2.resize(restored_face, (fs1, fs2))
            # feat_applied = restored_face
            cv2.imshow("Makeup",  feat_applied)
            cv2.imshow("orginal", oface_image)
            
            cv2.imwrite('face.png', face_image )
            save_restore_path = os.path.join('./results/', f'restoredi_{ff}.png')
            ff=ff+1
            
            #imwrite(restored_face, save_restore_path)
                # key_pressed = cv2.waitKey(500)
                # if not(key_pressed & 0xFF == ord('q')): # q=quit
                #    
                # else: 
                #     break
        k = cv2.waitKey(1) & 0xFF
        if k  == 27:
            break
                # Draw the extended bounding box on the original image (optional)
                #cv2.rectangle(image, (new_x, new_y), (new_x + new_w, new_y + new_h), (0, 255, 0), 2)

        # Display the original video with annotations
        #cv2.imshow('Webcam Feed', image)

        # Break loop with 'q'
    # if cv2.waitKey(2) & 0xFF == ord('q'):
    #     break

# Release the video capture and close windowsqq
cap.release()
cv2.destroyAllWindows()
